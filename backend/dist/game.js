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
const avatars_1 = require("./avatars");
class Game {
    constructor(gameId, username, player, rounds, maxPlayers) {
        this.players = [];
        this.id = gameId;
        this.playerToUserMap = new Map([]);
        this.playerToScoreMap = new Map([]);
        this.playerStats = [];
        this.rounds = rounds;
        this.maxPlayers = maxPlayers;
        this.words = [];
        this.choosenWord = "wtf";
        this.choosenPlayer = null;
        this.guessOn = false;
        this.playerGuessedCorrect = 0;
        this.guessTimer = setTimeout(() => "", 0);
        this.gameCreator = player;
        this.isGameStarted = false;
    }
    joinGame(socket, username) {
        if (!this.players.includes(socket)) {
            this.players.push(socket);
            const randomIndex = Math.floor(Math.random() * avatars_1.AVATARS.length);
            const user = {
                username: username,
                avatar: avatars_1.AVATARS[randomIndex],
            };
            this.playerToUserMap.set(socket, user);
            this.playerStats.push({ player: socket, score: 0 });
        }
    }
    changeAvatar(socket, avatar) {
        const requiredPlayer = this.players.find((player) => player === socket);
        if (!requiredPlayer)
            return;
        const user = this.playerToUserMap.get(requiredPlayer);
        console.log("tochange-avatar", user);
        if (!user)
            return;
        user.avatar = avatar;
    }
    leaveGame(socket) {
        this.players = this.players.filter((player) => player !== socket);
        this.playerStats = this.playerStats.filter((playerStat) => playerStat.player !== socket);
        this.playerToUserMap.delete(socket);
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
                    console.log("Word choosen: ", msg.choosenWord);
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
            let isSent = false;
            setInterval(() => {
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
        let highestScorer = {
            username: '',
            avatar: '',
        };
        for (let player of this.players) {
            let score = this.playerToScoreMap.get(player);
            let scorer = this.playerToUserMap.get(player);
            if (score && score > highestScore) {
                highestScore = score;
                if (scorer) {
                    highestScorer = scorer;
                }
            }
        }
        let winner = {
            winner: highestScorer,
            score: highestScore
        };
        return winner;
    }
    startGame(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.gameCreator !== socket)
                return;
            if (this.players.indexOf(socket) === -1)
                return;
            this.players.forEach((player) => {
                player.send(JSON.stringify({
                    type: 'GAME_STARTED_BY_OWNER',
                    gameId: this.id,
                }));
            });
            console.log("Game started");
            this.isGameStarted = true;
            for (let i = 0; i < this.rounds; i++) {
                console.log("iteration: ", i + 1);
                for (let player of this.players) {
                    this.choosenPlayer = player;
                    console.log("choosen player: ", this.playerToUserMap.get(player));
                    let allPlayersWithScore = [];
                    for (let p of this.players) {
                        let score = this.playerToScoreMap.get(p);
                        let user = this.playerToUserMap.get(p);
                        allPlayersWithScore.push({
                            user: user,
                            score: score
                        });
                    }
                    for (let player of this.players) {
                        player.send(JSON.stringify({
                            type: 'GET_ALL_PLAYERS_WITH_SCORE',
                            gameId: this.id,
                            allPlayersWithScore: allPlayersWithScore
                        }));
                    }
                    this.words = (0, random_word_slugs_1.generateSlug)(3).split("-");
                    player.send(JSON.stringify({
                        type: 'GIVEN_WORDS_TO_CHOOSE',
                        choosenPlayer: this.playerToUserMap.get(player),
                        words: this.words,
                        round: i,
                    }));
                    for (let p of this.players) {
                        if (p !== player) {
                            p.send(JSON.stringify({
                                type: 'ANOTHER_PLAYER_IS_CHOOSING',
                                choosingPlayer: this.playerToUserMap.get(player),
                            }));
                        }
                    }
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
                            correct: true,
                            username: ''
                        }));
                    }
                }
            }
            let allPlayersWithScore = [];
            for (let p of this.players) {
                let score = this.playerToScoreMap.get(p);
                let user = this.playerToUserMap.get(p);
                allPlayersWithScore.push({
                    user: user,
                    score: score
                });
            }
            let winner = this.determineWinner();
            for (let player of this.players) {
                player.send(JSON.stringify({
                    type: 'GAME_OVER',
                    winner: winner,
                    allPlayersWithScore: allPlayersWithScore,
                    gameId: this.id,
                }));
            }
        });
    }
    guessWord(socket, word, timeTaken) {
        var _a, _b;
        if (!this.guessOn)
            return console.log("guess is not on");
        if (this.players.indexOf(socket) === -1)
            return console.log("player is not in game");
        if (socket === this.choosenPlayer)
            return console.log("guess not allowed");
        if (word === this.choosenWord) {
            console.log("correct guess");
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
                        guess: `${(_a = this.playerToUserMap.get(socket)) === null || _a === void 0 ? void 0 : _a.username} guessed correctly`,
                        correct: true,
                        username: ''
                    }));
                }
            }
        }
        else {
            console.log("incorrect guess");
            for (let p of this.players) {
                if (p !== socket) {
                    p.send(JSON.stringify({
                        type: 'ADD_GUESS_TO_CHAT',
                        gameId: this.id,
                        guess: word,
                        correct: false,
                        username: (_b = this.playerToUserMap.get(socket)) === null || _b === void 0 ? void 0 : _b.username
                    }));
                }
            }
        }
    }
    leftGame(socket) {
        if (this.players.includes(socket)) {
            this.players = this.players.filter(p => p !== socket);
        }
    }
}
exports.Game = Game;
