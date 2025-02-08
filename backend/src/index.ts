import { WebSocketServer } from 'ws';
import { GameManager } from './gameManager';

const wss = new WebSocketServer({ port: 8080 });
wss.setMaxListeners(30);
const gameManager = new GameManager();

wss.on('connection', function connection(ws){
    console.log("a new user joined");
    ws.on('message', (data)=>{
        const msg = JSON.parse(data.toString());
        
        if(msg.type === 'START_NEW_GAME'){
            gameManager.initiateGame(ws, msg.username, parseInt(msg.rounds), msg.maxPlayers);
        }else if(msg.type === 'JOIN_GAME'){
            gameManager.handleJoinGame(ws, msg.username, msg.gameId);
        }else if(msg.type === 'START_GAME'){
            gameManager.handleStartGame(ws, msg.gameId);
        }else if(msg.type === 'GUESS_WORD'){
            gameManager.handleGuessWord(ws, msg.word, msg.timeTaken, msg.gameId);
        }else if(msg.type === 'DRAW_BEGIN'){
            gameManager.handleDrawBegin(ws, msg.gameId, msg.offsetX, msg.offsetY);
        }else if(msg.type === 'DRAW_FILL'){
            gameManager.handleDrawFill(ws, msg.gameId, msg.clientX, msg.clientY, msg.color);
        }else if(msg.type === 'DRAW_UPDATE'){
            gameManager.handleDrawUpdate(ws, msg.gameId, msg.offsetX, msg.offsetY);
        }else if(msg.type === 'DRAW_END'){
            gameManager.handleDrawEnd(ws, msg.gameId);
        }else if(msg.type === 'DRAW_CLEAR'){
            gameManager.handleDrawClear(ws, msg.gameId);
        }else if(msg.type === 'DRAW_CHANGE_COLOR'){
            gameManager.handleDrawChangeColor(ws, msg.gameId, msg.color);
        }else if(msg.type === 'DRAW_CHANGE_FILL_COLOR'){
            gameManager.handleDrawChangeFillColor(ws, msg.gameId, msg.color);
        }else if(msg.type === 'DRAW_ERASE'){
            gameManager.handleEraseCanvas(ws, msg.gameId);
        }else if(msg.type === 'DRAW_UNDO'){
            console.log("undo called");
            gameManager.handleUndoCanvas(ws, msg.gameId, msg.canvasurl);
        }else if(msg.type === 'CHANGE_AVATAR'){
            gameManager.handleChangeAvatar(ws, msg.avatar, msg.gameId);
        }else if(msg.type === 'DELETE_GAME'){
            gameManager.handleDeleteGame(ws, msg.gameId);
        }
    })

    wss.on('dissconnect', ()=>console.log("user disconnected"));
})