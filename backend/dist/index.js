"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const gameManager_1 = require("./gameManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const gameManager = new gameManager_1.GameManager();
wss.on('connection', function connection(ws) {
    console.log("a new user joined");
    ws.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'START_NEW_GAME') {
            gameManager.initiateGame(ws, msg.username, parseInt(msg.rounds));
        }
        else if (msg.type === 'JOIN_GAME') {
            gameManager.handleJoinGame(ws, msg.username, msg.gameId);
        }
        else if (msg.type === 'START_GAME') {
            gameManager.handleStartGame(ws, msg.gameId);
        }
        else if (msg.type === 'GUESS_WORD') {
            gameManager.handleGuessWord(ws, msg.word, msg.timeTaken, msg.gameId);
        }
        else if (msg.type === 'DRAW_BEGIN') {
            gameManager.handleDrawBegin(ws, msg.gameId, msg.offsetX, msg.offsetY);
        }
        else if (msg.type === 'DRAW_UPDATE') {
            gameManager.handleDrawUpdate(ws, msg.gameId, msg.offsetX, msg.offsetY);
        }
        else if (msg.type === 'DRAW_END') {
            gameManager.handleDrawEnd(ws, msg.gameId);
        }
        else if (msg.type === 'DRAW_CLEAR') {
            gameManager.handleDrawClear(ws, msg.gameId);
        }
        else if (msg.type === 'DRAW_CHANGE_COLOR') {
            gameManager.handleDrawChangeColor(ws, msg.gameId, msg.color);
        }
        else if (msg.type === 'DRAW_ERASE') {
            gameManager.handleEraseCanvas(ws, msg.gameId);
        }
        else if (msg.type === 'DRAW_UNDO') {
            console.log("undo called");
            gameManager.handleUndoCanvas(ws, msg.gameId, msg.canvasurl);
        }
    });
    wss.on('dissconnect', () => console.log("user disconnected"));
});
