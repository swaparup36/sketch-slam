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
    initiateGame(socket, username, rounds, maxPlayers) {
        this.gameId = (0, generate_unique_id_1.default)({ length: 7 });
        console.log(this.gameId);
        const game = new game_1.Game(this.gameId, username, socket, rounds, maxPlayers);
        this.games.push(game);
        game.joinGame(socket, username);
        socket.send(JSON.stringify({
            game_id: this.gameId,
        }));
    }
    handleJoinGame(socket, username, gameId) {
        var _a;
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            requiredGame.joinGame(socket, username);
            let allPlayers = [];
            for (let player of requiredGame.players) {
                let playerUser = requiredGame === null || requiredGame === void 0 ? void 0 : requiredGame.playerToUserMap.get(player);
                console.log("user: ", playerUser);
                allPlayers.push(playerUser);
            }
            for (let player of requiredGame.players) {
                player.send(JSON.stringify({
                    type: "GET_ALL_PLAYERS",
                    gameId: gameId,
                    players: allPlayers,
                    creator: (_a = requiredGame.playerToUserMap.get(requiredGame.gameCreator)) === null || _a === void 0 ? void 0 : _a.username,
                }));
            }
        }
        else {
            socket.send("Game does not exists");
        }
    }
    handleChangeAvatar(socket, avatar, gameId) {
        var _a;
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            requiredGame.changeAvatar(socket, avatar);
            let allPlayers = [];
            for (let player of requiredGame.players) {
                let playerUser = requiredGame === null || requiredGame === void 0 ? void 0 : requiredGame.playerToUserMap.get(player);
                console.log("user: ", playerUser);
                allPlayers.push(playerUser);
            }
            for (let player of requiredGame.players) {
                player.send(JSON.stringify({
                    type: "GET_ALL_PLAYERS",
                    gameId: gameId,
                    players: allPlayers,
                    creator: (_a = requiredGame.playerToUserMap.get(requiredGame.gameCreator)) === null || _a === void 0 ? void 0 : _a.username,
                }));
            }
        }
        else {
            socket.send(JSON.stringify({
                type: "GAME_DOES_NOT_EXIST",
            }));
        }
    }
    handleLeaveGame(socket, gameId) {
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            requiredGame.leaveGame(socket);
        }
        else {
            socket.send(JSON.stringify({
                type: "GAME_DOES_NOT_EXIST",
            }));
        }
    }
    handleStartGame(socket, gameId) {
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            requiredGame.startGame(socket);
        }
        else {
            socket.send(JSON.stringify({
                type: "GAME_DOES_NOT_EXIST",
            }));
        }
    }
    handleDeleteGame(socket, gameId) {
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            this.games = this.games.filter((game) => game.id !== gameId);
        }
        else {
            socket.send(JSON.stringify({
                type: "GAME_DOES_NOT_EXIST",
            }));
        }
    }
    handleGuessWord(socket, word, timeTaken, gameId) {
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            requiredGame.guessWord(socket, word, timeTaken);
        }
        else {
            socket.send(JSON.stringify({
                type: "GAME_DOES_NOT_EXIST",
            }));
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
            socket.send(JSON.stringify({
                type: "GAME_DOES_NOT_EXIST",
            }));
        }
    }
    handleDrawFill(socket, gameId, clientX, clientY, color) {
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            for (let player of requiredGame.players) {
                if (player !== socket) {
                    player.send(JSON.stringify({
                        type: 'DRAW_FILL',
                        gameId: gameId,
                        clientX: clientX,
                        clientY: clientY,
                        color: color
                    }));
                }
            }
        }
        else {
            socket.send(JSON.stringify({
                type: "GAME_DOES_NOT_EXIST",
            }));
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
            socket.send(JSON.stringify({
                type: "GAME_DOES_NOT_EXIST",
            }));
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
            socket.send(JSON.stringify({
                type: "GAME_DOES_NOT_EXIST",
            }));
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
            socket.send(JSON.stringify({
                type: "GAME_DOES_NOT_EXIST",
            }));
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
            socket.send(JSON.stringify({
                type: "GAME_DOES_NOT_EXIST",
            }));
        }
    }
    handleDrawChangeFillColor(socket, gameId, color) {
        const requiredGame = this.games.find((game) => game.id === gameId);
        if (requiredGame) {
            for (let player of requiredGame.players) {
                if (player !== socket) {
                    player.send(JSON.stringify({
                        type: 'DRAW_CHANGE_FILL_COLOR',
                        gameId: gameId,
                        color: color
                    }));
                }
            }
        }
        else {
            socket.send(JSON.stringify({
                type: "GAME_DOES_NOT_EXIST",
            }));
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
            socket.send(JSON.stringify({
                type: "GAME_DOES_NOT_EXIST",
            }));
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
            socket.send(JSON.stringify({
                type: "GAME_DOES_NOT_EXIST",
            }));
        }
    }
}
exports.GameManager = GameManager;
