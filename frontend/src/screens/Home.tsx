import { useState } from "react";
import { GetContext } from "../context/ContextProvider";

function Home() {
  const [userName, setUserName] = useState<string>('');

  const context = GetContext();
  const {createNewGame, roomCode, setRoomCode, joinGame} = context;

  return (
    <div>
      <div className="home-form-holder">
        <form 
          onSubmit={(e)=>{
            e.preventDefault();
            createNewGame(userName);
          }}
        >
          <input type="text" value={userName} onChange={(e)=>setUserName(e.target.value)}/>
          <button type="submit">Create Room</button>
        </form>
      </div>
      <div className="home-form-holder">
        <form 
          onSubmit={(e)=>{
            e.preventDefault();
            joinGame(userName)
          }}
        >
          <input type="text" value={userName} onChange={(e)=>setUserName(e.target.value)}/>
          <input type="text" value={roomCode} onChange={(e)=>setRoomCode(e.target.value)}/>
          <button type="submit">Join Game</button>
        </form>
      </div>
    </div>
  )
}

export default Home