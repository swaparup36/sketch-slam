import { WebSocket } from "ws";
import { Game } from "./game";
import generateUniqueId from "generate-unique-id";

export class GameManager {
  private games: Game[];
  private gameId: any;

  constructor() {
    this.games = [];
    this.gameId = "";
  }

  initiateGame(socket: WebSocket, username: string, rounds: number, maxPlayers: number) {
    this.gameId = generateUniqueId({ length: 7 });
    console.log(this.gameId);
    const game: Game = new Game(this.gameId, username, socket, rounds, maxPlayers);
    this.games.push(game);
    game.joinGame(socket, username);
    socket.send(
      JSON.stringify({
        game_id: this.gameId,
      })
    );
  }

  handleJoinGame(socket: WebSocket, username: string, gameId: string) {
    const requiredGame: Game | undefined = this.games.find(
      (game) => game.id === gameId
    );
    if (requiredGame) {
      requiredGame.joinGame(socket, username);

      let allPlayers = [];
      for (let player of requiredGame.players) {
        let playerUser = requiredGame?.playerToUserMap.get(player);
        console.log("user: ", playerUser);
        allPlayers.push(playerUser);
      }

      for(let player of requiredGame.players){
        player.send(
          JSON.stringify({
            type: "GET_ALL_PLAYERS",
            gameId: gameId,
            players: allPlayers,
            creator: requiredGame.playerToUserMap.get(requiredGame.gameCreator)?.username,
          })
        );
      }
    } else {
      socket.send("Game does not exists");
    }
  }

  handleChangeAvatar(socket: WebSocket, avatar: string, gameId: string) {
    const requiredGame: Game | undefined = this.games.find(
      (game) => game.id === gameId
    );
    if (requiredGame) {
      requiredGame.changeAvatar(socket, avatar);
      
      let allPlayers = [];
      for (let player of requiredGame.players) {
        let playerUser = requiredGame?.playerToUserMap.get(player);
        console.log("user: ", playerUser);
        allPlayers.push(playerUser);
      }

      for(let player of requiredGame.players){
        player.send(
          JSON.stringify({
            type: "GET_ALL_PLAYERS",
            gameId: gameId,
            players: allPlayers,
            creator: requiredGame.playerToUserMap.get(requiredGame.gameCreator)?.username,
          })
        );
      }
    } else {
      socket.send(JSON.stringify({
        type: "GAME_DOES_NOT_EXIST",
      }));
    }
  }

  handleLeaveGame(socket: WebSocket, gameId: string) {
    const requiredGame: Game | undefined = this.games.find(
      (game) => game.id === gameId
    );
    if (requiredGame) {
      requiredGame.leaveGame(socket);
    } else {
      socket.send(JSON.stringify({
        type: "GAME_DOES_NOT_EXIST",
      }));
    }
  }

  handleStartGame(socket: WebSocket, gameId: string) {
    const requiredGame: Game | undefined = this.games.find(
      (game) => game.id === gameId
    );
    if (requiredGame) {
      requiredGame.startGame(socket);
    } else {
      socket.send(JSON.stringify({
        type: "GAME_DOES_NOT_EXIST",
      }));
    }
  }

  handleDeleteGame(socket: WebSocket, gameId: string) {
    const requiredGame: Game | undefined = this.games.find(
      (game) => game.id === gameId
    );
    if (requiredGame) {
      this.games = this.games.filter((game) => game.id !== gameId);
    } else {
      socket.send(JSON.stringify({
        type: "GAME_DOES_NOT_EXIST",
      }));
    }
  }

  handleGuessWord(
    socket: WebSocket,
    word: string,
    timeTaken: number,
    gameId: string
  ) {
    const requiredGame: Game | undefined = this.games.find(
      (game) => game.id === gameId
    );
    if (requiredGame) {
      requiredGame.guessWord(socket, word, timeTaken);
    } else {
      socket.send(JSON.stringify({
        type: "GAME_DOES_NOT_EXIST",
      }));
    }
  }

  handleDrawBegin(socket: WebSocket, gameId: string, offsetX: any, offsetY: any){
    const requiredGame: Game | undefined = this.games.find(
      (game) => game.id === gameId
    );
    if (requiredGame) {
      for(let player of requiredGame.players){
        if(player !== socket){
          player.send(JSON.stringify({
            type: 'DRAW_BEGIN',
            gameId: gameId,
            offsetX: offsetX,
            offsetY: offsetY
          }))
        }
      }
    } else {
      socket.send(JSON.stringify({
        type: "GAME_DOES_NOT_EXIST",
      }));
    }
  }

  handleDrawFill(socket: WebSocket, gameId: string, clientX: any, clientY: any, color: string){
    const requiredGame: Game | undefined = this.games.find(
      (game) => game.id === gameId
    );
    if (requiredGame) {
      for(let player of requiredGame.players){
        if(player !== socket){
          player.send(JSON.stringify({
            type: 'DRAW_FILL',
            gameId: gameId,
            clientX: clientX,
            clientY: clientY,
            color: color
          }))
        }
      }
    } else {
      socket.send(JSON.stringify({
        type: "GAME_DOES_NOT_EXIST",
      }));
    }
  }

  handleDrawUpdate(socket: WebSocket, gameId: string, offsetX: any, offsetY: any){
    const requiredGame: Game | undefined = this.games.find(
      (game) => game.id === gameId
    );
    if (requiredGame) {
      for(let player of requiredGame.players){
        if(player !== socket){
          player.send(JSON.stringify({
            type: 'DRAW_UPDATE',
            gameId: gameId,
            offsetX: offsetX,
            offsetY: offsetY
          }));
        }
      }
    } else {
      socket.send(JSON.stringify({
        type: "GAME_DOES_NOT_EXIST",
      }));
    }
  }

  handleDrawEnd(socket: WebSocket, gameId: string){
    const requiredGame: Game | undefined = this.games.find(
      (game) => game.id === gameId
    );
    if (requiredGame) {
      for(let player of requiredGame.players){
        if(player !== socket){
          player.send(JSON.stringify({
            type: 'DRAW_END',
            gameId: gameId
          }));
        }
      }
    } else {
      socket.send(JSON.stringify({
        type: "GAME_DOES_NOT_EXIST",
      }));
    }
  }

  handleDrawClear(socket: WebSocket, gameId: string){
    const requiredGame: Game | undefined = this.games.find(
      (game) => game.id === gameId
    );
    if (requiredGame) {
      for(let player of requiredGame.players){
        if(player !== socket){
          player.send(JSON.stringify({
            type: 'DRAW_CLEAR',
            gameId: gameId
          }));
        }
      }
    } else {
      socket.send(JSON.stringify({
        type: "GAME_DOES_NOT_EXIST",
      }));
    }
  }

  handleDrawChangeColor(socket: WebSocket, gameId: string, color: string){
    const requiredGame: Game | undefined = this.games.find(
      (game) => game.id === gameId
    );
    if (requiredGame) {
      for(let player of requiredGame.players){
        if(player !== socket){
          player.send(JSON.stringify({
            type: 'DRAW_CHANGE_COLOR',
            gameId: gameId,
            color: color
          }));
        }
      }
    } else {
      socket.send(JSON.stringify({
        type: "GAME_DOES_NOT_EXIST",
      }));
    }
  }

  handleDrawChangeFillColor(socket: WebSocket, gameId: string, color: string){
    const requiredGame: Game | undefined = this.games.find(
      (game) => game.id === gameId
    );
    if (requiredGame) {
      for(let player of requiredGame.players){
        if(player !== socket){
          player.send(JSON.stringify({
            type: 'DRAW_CHANGE_FILL_COLOR',
            gameId: gameId,
            color: color
          }));
        }
      }
    } else {
      socket.send(JSON.stringify({
        type: "GAME_DOES_NOT_EXIST",
      }));
    }
  }

  handleEraseCanvas(socket: WebSocket, gameId: string){
    const requiredGame: Game | undefined = this.games.find(
      (game) => game.id === gameId
    );
    if (requiredGame) {
      for(let player of requiredGame.players){
        if(player !== socket){
          player.send(JSON.stringify({
            type: 'DRAW_ERASE',
            gameId: gameId
          }));
        }
      }
    } else {
      socket.send(JSON.stringify({
        type: "GAME_DOES_NOT_EXIST",
      }));
    }
  }

  handleUndoCanvas(socket: WebSocket, gameId: string, canvasurl: string){
    const requiredGame: Game | undefined = this.games.find(
      (game) => game.id === gameId
    );
    if (requiredGame) {
      for(let player of requiredGame.players){
        if(player !== socket){
          player.send(JSON.stringify({
            type: 'DRAW_UNDO',
            gameId: gameId,
            canvasurl: canvasurl
          }));
        }
      }
    } else {
      socket.send(JSON.stringify({
        type: "GAME_DOES_NOT_EXIST",
      }));
    }
  }
}
