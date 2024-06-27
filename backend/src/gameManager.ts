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

  initiateGame(socket: WebSocket, username: string, rounds: number) {
    this.gameId = generateUniqueId({ length: 7 });
    console.log(this.gameId);
    const game: Game = new Game(this.gameId, username, socket, rounds);
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
        let playerUsername = requiredGame?.playerToUsernameMap.get(player);
        console.log("username: ", playerUsername);
        allPlayers.push(playerUsername);
      }

      for(let player of requiredGame.players){
        player.send(
          JSON.stringify({
            type: "GET_ALL_PLAYERS",
            gameId: gameId,
            players: allPlayers,
          })
        );
      }
    } else {
      socket.send("Game does not exists");
    }
  }

  handleLeaveGame(socket: WebSocket, gameId: string) {
    const requiredGame: Game | undefined = this.games.find(
      (game) => game.id === gameId
    );
    if (requiredGame) {
      requiredGame.leaveGame(socket);
    } else {
      socket.send("Game does not exists");
    }
  }

  handleStartGame(socket: WebSocket, gameId: string) {
    const requiredGame: Game | undefined = this.games.find(
      (game) => game.id === gameId
    );
    if (requiredGame) {
      requiredGame.startGame(socket);
    } else {
      socket.send("Game does not exists");
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
      socket.send("Game does not exists");
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
      socket.send("Game does not exists");
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
      socket.send("Game does not exists");
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
      socket.send("Game does not exists");
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
      socket.send("Game does not exists");
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
      socket.send("Game does not exists");
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
      socket.send("Game does not exists");
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
      socket.send("Game does not exists");
    }
  }
}
