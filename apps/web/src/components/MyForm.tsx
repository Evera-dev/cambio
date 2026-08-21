import { useState } from 'react';
import { socket } from '../socket';

export function MyForm() {
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

function onSubmit(event: React.SubmitEvent<HTMLFormElement>) {
  event.preventDefault();
  setIsLoading(true);

  console.log(value)
    socket.emit('room:create', {
    playerName: value,
    });
    setIsLoading(false)
}

  return (
    <form onSubmit={ onSubmit }>
      <input onChange={ e => setValue(e.target.value) } />

      <button type="submit" disabled={ isLoading }>Submit</button>
    </form>
  );
}