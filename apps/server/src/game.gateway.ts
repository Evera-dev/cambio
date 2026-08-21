import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Room, Player } from '@cambio/contracts';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private rooms = new Map<string, Room>();

  handleConnection(client: Socket) {
    console.log(`Conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Desconectado: ${client.id}`);

    this.removePlayerFromRooms(client.id);
  }

  @SubscribeMessage('room:create')
  createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { playerName: string },
  ) {
    const roomId = crypto.randomUUID();
    console.log(`Hola: ${body.playerName}`);

    const player: Player = {
      id: crypto.randomUUID(),
      socketId: client.id,
      name: body.playerName,
    };

    const room: Room = {
      id: roomId,
      hostId: player.id,
      players: [player],
    };

    this.rooms.set(roomId, room);

    client.join(roomId);

    return {
      roomId,
      room,
    };
  }

  @SubscribeMessage('room:join')
  joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    body: {
      roomId: string;
      playerName: string;
    },
  ) {
    const room = this.rooms.get(body.roomId);

    if (!room) {
      throw new WsException('Room not found');
    }

    const player: Player = {
      id: crypto.randomUUID(),
      socketId: client.id,
      name: body.playerName,
    };

    room.players.push(player);

    client.join(room.id);

    this.server.to(room.id).emit('room:updated', room);

    return room;
  }

  private removePlayerFromRooms(socketId: string) {
    for (const [roomId, room] of this.rooms.entries()) {
      const playerIndex = room.players.findIndex(
        (player) => player.socketId === socketId,
      );

      if (playerIndex === -1) {
        continue;
      }

      room.players.splice(playerIndex, 1);

      if (room.players.length === 0) {
        this.rooms.delete(roomId);
        continue;
      }

      this.server.to(roomId).emit('room:updated', room);
    }
  }
}
