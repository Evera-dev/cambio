import { useState } from "react";
import { socket } from "../socket";

export function HomePage() {
    const [value, setValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function createRoom(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        socket.connect();

        const response = await socket.emitWithAck('room:create', {
            playerName: value,
        });
        
        console.log("resposne ", response)


        setIsLoading(false)
    }


    return (
        <>
            <div className="App">
                <h1>Cambio</h1>
                <p>Con las reglas originales. Sin power ups ni guionazos</p>

                <form onSubmit={createRoom}>
                    <label htmlFor="nickname">Ingrese un nombre</label>
                    <input type="text" onChange={ e => setValue(e.target.value) } name="nickname"/>
                    <button disabled={ isLoading } type="submit">Crear sala</button>
                    <button disabled={ isLoading }> Unirse a sala sala</button>
                </form>
            </div>
        </>
    )
}