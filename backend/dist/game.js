"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const random_word_slugs_1 = require("random-word-slugs");
class Game {
    constructor(gameId, username, player, rounds) {
        this.players = [];
        this.id = gameId;
        this.playerToUsernameMap = new Map([]);
        this.playerToScoreMap = new Map([]);
        this.playerStats = [];
        this.rounds = rounds;
        this.words = [];
        this.choosenWord = "wtf";
        this.choosenPlayer = null;
        this.guessOn = false;
        this.playerGuessedCorrect = 0;
        this.guessTimer = setTimeout(() => "", 0);
    }
    joinGame(socket, username) {
        this.players.push(socket);
        this.playerToUsernameMap.set(socket, username);
        this.playerStats.push({ player: socket, score: 0 });
    }
    leaveGame(socket) {
        this.players = this.players.filter((player) => player !== socket);
        this.playerStats = this.playerStats.filter((playerStat) => playerStat.player !== socket);
        this.playerToUsernameMap.delete(socket);
    }
    handleGameEvent(player) {
        if (player !== this.choosenPlayer)
            return;
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.choosenWord =
                    this.words[Math.floor(Math.random() * this.words.length)];
                // reject('No message received within 30 seconds.');
                resolve("Word Chosen automatically");
                player.send(JSON.stringify({
                    type: 'WORD_CHOOSEN_AUTOMATICALLY',
                    gameId: this.id,
                    choosenWord: this.choosenWord
                }));
            }, 30000); // 30 seconds timeout
            player.on("message", (data) => {
                const msg = JSON.parse(data.toString());
                if (msg.type === "WORD_CHOSEN") {
                    if (msg.gameId !== this.id)
                        return;
                    this.choosenWord = msg.choosenWord;
                    clearTimeout(timeout);
                    resolve("word choosen");
                }
            });
        });
    }
    waitForGuess() {
        return new Promise((resolve, reject) => {
            this.playerGuessedCorrect = 0;
            this.guessOn = true;
            const timer = setTimeout(() => {
                this.guessOn = false;
                resolve("time up");
            }, 180000);
            setInterval(() => {
                let isSent = false;
                if (this.playerGuessedCorrect === this.players.length - 1 && !isSent) {
                    resolve('all guessed correctly');
                    for (let p of this.players) {
                        p.send(JSON.stringify({
                            type: 'ALL_PLAYERS_GUESSED_CORRECTLY',
                            gameId: this.id
                        }));
                    }
                    isSent = true;
                }
            }, 1000);
        });
    }
    determineWinner() {
        let highestScore = 0;
        let highestScorer = '';
        for (let player of this.players) {
            let score = this.playerToScoreMap.get(player);
            let scorer = this.playerToUsernameMap.get(player);
            if (score && score > highestScore) {
                highestScore = score;
                if (scorer) {
                    highestScorer = scorer;
                }
            }
        }
        let winner = {
            username: highestScorer,
            score: highestScore
        };
        return winner;
    }
    startGame(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.players.indexOf(socket) === -1)
                return;
            this.players.forEach((player) => {
                player.send(JSON.stringify({
                    type: 'GAME_STARTED_BY_OWNER',
                    gameId: this.id,
                }));
            });
            console.log("Game started");
            for (let i = 0; i < this.rounds; i++) {
                console.log("iteration: ", i + 1);
                for (let player of this.players) {
                    this.choosenPlayer = player;
                    console.log("choosen player: ", this.playerToUsernameMap.get(player));
                    let allPlayersWithScore = [];
                    for (let p of this.players) {
                        let score = this.playerToScoreMap.get(p);
                        let username = this.playerToUsernameMap.get(p);
                        allPlayersWithScore.push({
                            username: username,
                            score: score
                        });
                    }
                    for (let player of this.players) {
                        if (player !== socket) {
                            player.send(JSON.stringify({
                                type: 'GET_ALL_PLAYERS_WITH_SCORE',
                                gameId: this.id,
                                allPlayersWithScore: allPlayersWithScore
                            }));
                        }
                    }
                    this.words = (0, random_word_slugs_1.generateSlug)(3).split("-");
                    player.send(JSON.stringify({
                        type: 'GIVEN_WORDS_TO_CHOOSE',
                        choosenPlayer: this.playerToUsernameMap.get(player),
                        words: this.words,
                        round: i,
                    }));
                    const result = yield this.handleGameEvent(this.choosenPlayer);
                    console.log(result);
                    for (let p of this.players) {
                        if (p !== player) {
                            p.send(JSON.stringify({
                                type: 'START_GUESSING',
                                gameId: this.id,
                                word: this.choosenWord
                            }));
                        }
                    }
                    const response = yield this.waitForGuess();
                    console.log(response);
                    for (let p of this.players) {
                        p.send(JSON.stringify({
                            type: 'ADD_GUESS_TO_CHAT',
                            gameId: this.id,
                            guess: `${this.choosenWord} was the correct word`,
                            correct: true
                        }));
                    }
                }
            }
            let winner = this.determineWinner();
            for (let player of this.players) {
                player.send(JSON.stringify({
                    type: 'GAME_OVER',
                    winner: winner,
                    gameId: this.id,
                }));
            }
        });
    }
    guessWord(socket, word, timeTaken) {
        if (!this.guessOn)
            return;
        if (this.players.indexOf(socket) === -1)
            return;
        if (socket === this.choosenPlayer)
            return;
        if (word === this.choosenWord) {
            this.playerGuessedCorrect = this.playerGuessedCorrect + 1;
            socket.send(JSON.stringify({
                type: 'CORRECT_GUESS',
                success: true,
                score: (180000 - timeTaken) * 0.0005,
                word: word
            }));
            let prevScore = this.playerToScoreMap.get(socket);
            if (prevScore) {
                this.playerToScoreMap.set(socket, prevScore + ((180000 - timeTaken) * 0.0005));
            }
            else {
                this.playerToScoreMap.set(socket, (180000 - timeTaken) * 0.0005);
            }
            for (let p of this.players) {
                if (p !== socket) {
                    p.send(JSON.stringify({
                        type: 'ADD_GUESS_TO_CHAT',
                        gameId: this.id,
                        guess: `${this.playerToUsernameMap.get(p)} guessed correctly`,
                        correct: true
                    }));
                }
            }
        }
        else {
            for (let p of this.players) {
                if (p !== socket) {
                    p.send(JSON.stringify({
                        type: 'ADD_GUESS_TO_CHAT',
                        gameId: this.id,
                        guess: word,
                        correct: false
                    }));
                }
            }
        }
    }
}
exports.Game = Game;
