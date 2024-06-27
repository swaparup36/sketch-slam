"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const game_1 = require("./game");
const generate_unique_id_1 = __importDefault(require("generate-unique-id"));
class GameManager {
    constructor() {
        this.games = [];
        this.gameId = "";
    }
    initiateGame(socket, username, rounds) {
        this.gameId = (0, generate_unique_id_1.default)({ length: 7 });
        console.log(this.gameId);
        const game = new game_1.Game(this.gameId, username, socket, rounds);
        this.games.push(game);
        game.joinGame(socket, username);
        socket.send(JSON.stringify({
            game_id: this.gameId,
        }));
    }
    handleJoinGame(socket, username, gameId) {
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            requiredGame.joinGame(socket, username);
            let allPlayers = [];
            for (let player of requiredGame.players) {
                let playerUsername = requiredGame === null || requiredGame === void 0 ? void 0 : requiredGame.playerToUsernameMap.get(player);
                console.log("username: ", playerUsername);
                allPlayers.push(playerUsername);
            }
            for (let player of requiredGame.players) {
                player.send(JSON.stringify({
                    type: "GET_ALL_PLAYERS",
                    gameId: gameId,
                    players: allPlayers,
                }));
            }
        }
        else {
            socket.send("Game does not exists");
        }
    }
    handleLeaveGame(socket, gameId) {
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            requiredGame.leaveGame(socket);
        }
        else {
            socket.send("Game does not exists");
        }
    }
    handleStartGame(socket, gameId) {
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            requiredGame.startGame(socket);
        }
        else {
            socket.send("Game does not exists");
        }
    }
    handleGuessWord(socket, word, timeTaken, gameId) {
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            requiredGame.guessWord(socket, word, timeTaken);
        }
        else {
            socket.send("Game does not exists");
        }
    }
    handleDrawBegin(socket, gameId, offsetX, offsetY) {
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            for (let player of requiredGame.players) {
                if (player !== socket) {
                    player.send(JSON.stringify({
                        type: 'DRAW_BEGIN',
                        gameId: gameId,
                        offsetX: offsetX,
                        offsetY: offsetY
                    }));
                }
            }
        }
        else {
            socket.send("Game does not exists");
        }
    }
    handleDrawUpdate(socket, gameId, offsetX, offsetY) {
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            for (let player of requiredGame.players) {
                if (player !== socket) {
                    player.send(JSON.stringify({
                        type: 'DRAW_UPDATE',
                        gameId: gameId,
                        offsetX: offsetX,
                        offsetY: offsetY
                    }));
                }
            }
        }
        else {
            socket.send("Game does not exists");
        }
    }
    handleDrawEnd(socket, gameId) {
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            for (let player of requiredGame.players) {
                if (player !== socket) {
                    player.send(JSON.stringify({
                        type: 'DRAW_END',
                        gameId: gameId
                    }));
                }
            }
        }
        else {
            socket.send("Game does not exists");
        }
    }
    handleDrawClear(socket, gameId) {
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            for (let player of requiredGame.players) {
                if (player !== socket) {
                    player.send(JSON.stringify({
                        type: 'DRAW_CLEAR',
                        gameId: gameId
                    }));
                }
            }
        }
        else {
            socket.send("Game does not exists");
        }
    }
    handleDrawChangeColor(socket, gameId, color) {
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            for (let player of requiredGame.players) {
                if (player !== socket) {
                    player.send(JSON.stringify({
                        type: 'DRAW_CHANGE_COLOR',
                        gameId: gameId,
                        color: color
                    }));
                }
            }
        }
        else {
            socket.send("Game does not exists");
        }
    }
    handleEraseCanvas(socket, gameId) {
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            for (let player of requiredGame.players) {
                if (player !== socket) {
                    player.send(JSON.stringify({
                        type: 'DRAW_ERASE',
                        gameId: gameId
                    }));
                }
            }
        }
        else {
            socket.send("Game does not exists");
        }
    }
    handleUndoCanvas(socket, gameId, canvasurl) {
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            for (let player of requiredGame.players) {
                if (player !== socket) {
                    player.send(JSON.stringify({
                        type: 'DRAW_UNDO',
                        gameId: gameId,
                        canvasurl: canvasurl
                    }));
                }
            }
        }
        else {
            socket.send("Game does not exists");
        }
    }
}
exports.GameManager = GameManager;
