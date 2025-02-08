import { Route, Routes } from "react-router-dom";
import Landing from "../screen/Landing";
import CreateRoom from "../screen/Create";
import JoinRoom from "../screen/Join";
import Lobby from "../screen/Lobby";
import Game from "../screen/Game";
import About from "../screen/About";
import Features from "../screen/Features";
import HowToPlay from "../screen/HowToPlay";

function RoutesComponent() {
  return (
    <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/lobby/:gameid" element={<Lobby />} />
        <Route path="/game/:gameid" element={<Game />} />
    </Routes>
  )
}

export default RoutesComponent;