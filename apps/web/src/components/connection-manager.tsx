import { socket } from '../socket';

export function ConnectionManager() {


  function disconnect() {
    socket.disconnect();
  }

  return (
    <>
      <button onClick={ disconnect }>Disconnect</button>
    </>
  );
}