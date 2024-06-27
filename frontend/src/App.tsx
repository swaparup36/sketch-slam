import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import GameRoom from './screens/GameRoom';
import Game from './screens/Game';

function App(){

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/game/:roomcode' element={<GameRoom/>}/>
        <Route path='/game/play/:roomcode' element={<Game/>}/>
      </Routes>
    </>
  )
}

export default App
