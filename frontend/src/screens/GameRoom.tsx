// import { useEffect, useState } from "react";
// import { useSocket } from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";
import { GetContext } from "../context/ContextProvider";

function GameRoom() {
  const context = GetContext();
  const {players} = context;

  const navigate = useNavigate();

  return (
    <div>
      <div>
        Game Code : {window.location.pathname.split('/')[window.location.pathname.split('/').length-1]}
      </div>
        <div className="players">
          {
            players.map((player, i)=>{
              return <span key={i}>{player}</span>
            })
          }
        </div>
        <button onClick={()=>navigate(`/game/play/${window.location.pathname.split('/')[window.location.pathname.split('/').length-1]}`)}>Start Game</button>
    </div>
  )
}

export default GameRoom