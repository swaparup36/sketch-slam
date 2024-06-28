import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  TouchEventHandler,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSocket } from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";

export interface winnerInterface {
  username: string;
  score: number;
}

export interface allPlayersWithScoreInterface {
  username: string;
  score: number;
}

export interface allGuessesInterface {
  guess: string;
  correct: boolean;
}

type appContextProviderProps = {
  children: ReactNode
}

export interface appContext {
  players: string[],
  setPlayers: Dispatch<SetStateAction<string[]>>,
  wordlist: string[],
  setWordList: Dispatch<SetStateAction<string[]>>,
  round: number,
  setRound: Dispatch<SetStateAction<number>>,
  createNewGame: (userName: string) => void,
  joinGame: (userName: string) => void,
  guessWord: (guess: string) => void,
  chooseWord: (word: string) => void,
  roomCode: string,
  setRoomCode: Dispatch<SetStateAction<string>>,
  startGame: () => void,
  score: number,
  isGameOver: boolean,
  winner: winnerInterface | null,
  timerCount: number,
  chooseTimerCount: number,
  drawTimerCount: number,
  isChoosing: boolean,
  isGuessing: boolean,
  beginDraw: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void,
  beginDrawTouch: (e: React.TouchEvent<HTMLCanvasElement>) => void,
  updateDraw: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void,
  updateDrawTouch: TouchEventHandler<HTMLCanvasElement>,
  endDraw: () => void,
  clearCanvas: () => void,
  changeStrokeColor: (color: string) => void
  canvasContextReference: React.RefObject<CanvasRenderingContext2D>,
  canvasReference: React.RefObject<HTMLCanvasElement>,
  isDrawable: boolean,
  allPlayersWithScore: allPlayersWithScoreInterface[],
  allGuesses: allGuessesInterface[],
  choosenWord: string,
  hintWord: string,
  eraseCanvas: () => void,
  isErasing: boolean,
  undoCanvas: () => void
}

export const useDefaultState = () => {
  return {
    players: [],
    setPlayers: (players: string[]) => {},
    wordlist: [],
    setWordList: (wordlist: string[]) => {},
    round: 0,
    setRound: (round: number) => {},
    createNewGame: (userName: string) => {},
    joinGame: (userName: string) => {},
    guessWord: (guess: string) => {},
    chooseWord: (word: string) => {},
    roomCode: "",
    setRoomCode: (roomCode: string) => {},
    startGame: () => {},
    score: 0,
    isGameOver: false,
    winner: null,
    timerCount: 180,
    chooseTimerCount: 30,
    drawTimerCount: 180,
    isChoosing: false,
    isGuessing: false,
    beginDraw: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {},
    beginDrawTouch: (e: React.TouchEvent<HTMLCanvasElement>) => {},
    updateDraw: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {},
    updateDrawTouch: (event) => {},
    endDraw: () => {},
    clearCanvas: () => {},
    changeStrokeColor: (color: string) => {},
    canvasContextReference: useRef<CanvasRenderingContext2D>(null),
    canvasReference: useRef<HTMLCanvasElement>(null),
    isDrawable: false,
    allPlayersWithScore: [],
    allGuesses: [],
    choosenWord: "",
    hintWord: "",
    eraseCanvas: () => {},
    isErasing: false,
    undoCanvas: () => {}
  } as appContext
}


const AppContext = createContext(useDefaultState);

export const GetContext = () => {
  return useContext(AppContext);
};

const ContextProvider = ({children}: appContextProviderProps) => {
  const socket = useSocket();
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState<string>("");
  const [players, setPlayers] = useState<string[]>([]);
  const [wordlist, setWordList] = useState<string[]>([]);
  const [round, setRound] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<winnerInterface | null>(null);
  const [timer, setTimer] = useState<Date | null>(null);
  const [timerCount, setTimerCount] = useState<number>(180);
  const [chooseTimerCount, setChooseTimerCount] = useState<number>(30);
  const [drawTimerCount, setDrawTimerCount] = useState<number>(180);
  const [isGuessing, setIsGuessing] = useState<boolean>(false);
  const [isChoosing, setIsChoosing] = useState<boolean>(false);
  const canvasReference = useRef<HTMLCanvasElement>(null);
  const canvasContextReference = useRef<CanvasRenderingContext2D>(null);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [isDrawable, setIsDrawable] = useState<boolean>(false);
  const [allPlayersWithScore, setAllPlayersWithScore] = useState<allPlayersWithScoreInterface[]>([]);
  const [allGuesses, setAllGuesses] = useState<allGuessesInterface[]>([]);
  const [choosenWord, setChoosenWord] = useState<string>('');
  const [isErasing, setIsErasing] = useState<boolean>(false);
  let wordToGuess: string = '';
  const [hintWord, setHintWord] = useState<string>('');
  let times = -1;
  let chooseTimes = -1;
  let drawTimes = -1;
  // const [strokeColor, setStrokColor] = useState<string>("black");
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);

  const createNewGame = (userName: string): void => {
    if (!socket) {
      return;
    }
    sessionStorage.setItem("desiscribbleusername", userName);
    socket.send(
      JSON.stringify({ type: "START_NEW_GAME", username: userName, rounds: 3 })
    );
  };

  const joinGame = (userName: string) => {
    // navigate(`/game/${roomCode}`);
    if (!socket) {
      return;
    }
    navigate(`/game/${roomCode}`);

    sessionStorage.setItem("desiscribbleusername", userName);
    socket.send(
      JSON.stringify({
        type: "JOIN_GAME",
        username: userName,
        gameId: roomCode,
      })
    );
    navigate(`/game/${roomCode}`);
  };

  const startGame = () => {
    if (!socket) {
      return;
    }
    socket.send(
      JSON.stringify({
        type: "START_GAME",
        username: sessionStorage.getItem("desiscribbleusername"),
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
      })
    );
    console.log("Game start msg sent");
  };

  const guessWord = (guess: string) => {
    let timeTaken = 0;
    if (!socket) {
      return;
    }

    if (timer) {
      timeTaken = new Date().getTime() - timer?.getTime();
    }
    socket.send(
      JSON.stringify({
        type: "GUESS_WORD",
        username: sessionStorage.getItem("desiscribbleusername"),
        timeTaken: timeTaken,
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
        word: guess,
      })
    );
    const allGuessesMade: allGuessesInterface[] = allGuesses;
    allGuessesMade.push({
      guess: guess,
      correct: false
    });

    setAllGuesses(allGuessesMade);
  };

  const chooseWord = (word: string) => {
    if (!socket) {
      return;
    }

    socket.send(
      JSON.stringify({
        type: "WORD_CHOSEN",
        username: sessionStorage.getItem("desiscribbleusername"),
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
        choosenWord: word,
      })
    );
    
    setWordList([]);
    setChoosenWord(word);
    setIsChoosing(false);
    chooseTimes = -1;
    StartDrawTimer();
    setIsDrawable(true);
  };

  const replaceChar = (origString: string, replaceChar: string, index: number): string => {
    const firstPart: string = origString.substr(0, index);

    const lastPart: string = origString.substr(index + 1);

    const newString: string =
        firstPart + replaceChar + lastPart;

    return newString;
  }

  const StartGuessTimer = () => {
    setTimerCount(180);
    times = 180;
    let hintUpdate = '';
    const interval = setInterval(() => {
      times = times - 0.25;
      if (times >= 0) {
        if(times <= 121 && times >= 119){
          console.log("wordToGuess: ", wordToGuess.charAt(wordToGuess.length/2));
          const hint: string = replaceChar(hintWord.padStart(wordToGuess.length, "_"), wordToGuess.charAt(wordToGuess.length/2), wordToGuess.length/2)
          hintUpdate = hint;
          console.log("wordToHint: ", hint);
          setHintWord(hint);
          
        }else if(times <= 61 && times >= 59){
          const hint: string = replaceChar(hintUpdate, wordToGuess.charAt(0), 0);
          setHintWord(hint);
        }
        setTimerCount(times);
        // console.log('second: ', times);
      } else {
        setIsGuessing(false);
        console.log("clearing the interval...");
        clearInterval(interval);
      }
    }, 1000);
  };

  const StartDrawTimer = () => {
    setDrawTimerCount(180);
    drawTimes = 180;
    const interval = setInterval(() => {
      drawTimes = drawTimes -1;
      if (drawTimes >= 0) {
        setDrawTimerCount(drawTimes);
        // console.log('second: ', drawTimes);
      } else {
        console.log("clearing the interval...");
        clearInterval(interval);
      }
    }, 1000);
    setIsDrawable(false);
  };

  const StartChooseTimer = () => {
    setChooseTimerCount(30);
    chooseTimes = 30;
    const interval = setInterval(() => {
      chooseTimes = chooseTimes - 0.25;
      if (chooseTimes >= 0) {
        setChooseTimerCount(chooseTimes);
        // console.log('second: ', chooseTimes);
      } else {
        console.log("clearing the interval...");
        setIsChoosing(false);
        clearInterval(interval);
      }
    }, 1000);
  };

  const beginDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if(!isDrawable){
      return;
    }

    if(!canvasContextReference.current) return;

    canvasContextReference.current.beginPath();
    canvasContextReference.current.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY 
    );
    setIsPressed(true);

    socket?.send(
      JSON.stringify({
        type: "DRAW_BEGIN",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY
      })
    );
  };

  const beginDrawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if(!isDrawable){
      return;
    }

    if(!canvasContextReference.current) return;

    canvasContextReference.current.beginPath();
    canvasContextReference.current.moveTo(
      e.nativeEvent.touches[0].clientX-50,
      e.nativeEvent.touches[0].clientY-300
    );
    setIsPressed(true);

    socket?.send(
      JSON.stringify({
        type: "DRAW_BEGIN",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
        offsetX: e.nativeEvent.touches[0].clientX-50,
        offsetY: e.nativeEvent.touches[0].clientY-300
      })
    );
  }

  const beginDrawAuto = (offsetX: number, offsetY: number) => {
    console.log("begin offsets: ", offsetX, " ", offsetY);

    if(!canvasContextReference.current) return;
    canvasContextReference.current.beginPath();
    canvasContextReference.current.moveTo(offsetX, offsetY);
    setIsPressed(true);
  };

  const endDraw = () => {
    if(!isDrawable){
      return;
    }

    if(!canvasContextReference.current) return;

    canvasContextReference.current.closePath();
    setIsPressed(false);

    socket?.send(
      JSON.stringify({
        type: "DRAW_END",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ]
      })
    );

    const canvasHis = canvasHistory;
    canvasHis.push(canvasReference.current.toDataURL());
    console.log(canvasHis);
    setCanvasHistory(canvasHis);
  }

  const endDrawAuto = () => {
    if(!canvasContextReference.current) return;
    canvasContextReference.current.closePath();
    setIsPressed(false);
  };

  const updateDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if(!isDrawable){
      return;
    }

    if (!isPressed) {
      return;
    }

    if(!canvasContextReference.current) return;

    canvasContextReference.current.lineTo(
      e.nativeEvent.offsetX ? e.nativeEvent.offsetX : e.nativeEvent.touches[0].clientX-50,
      e.nativeEvent.offsetY ? e.nativeEvent.offsetY : e.nativeEvent.touches[0].clientY-300
    );
    canvasContextReference.current.stroke();
    
    socket?.send(
      JSON.stringify({
        type: "DRAW_UPDATE",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
        offsetX: e.nativeEvent.offsetX ? e.nativeEvent.offsetX : e.nativeEvent.touches[0].clientX-50,
        offsetY: e.nativeEvent.offsetY ? e.nativeEvent.offsetY : e.nativeEvent.touches[0].clientY-300
      })
    );
  };

  const updateDrawTouch: React.TouchEventHandler<HTMLCanvasElement> = (e) => {
    if(!isDrawable){
      return;
    }

    if (!isPressed) {
      return;
    }

    if(!canvasContextReference.current) return;

    canvasContextReference.current.lineTo(
      e.nativeEvent.touches[0].clientX-50,
      e.nativeEvent.touches[0].clientY-300
    );
    canvasContextReference.current.stroke();
    
    socket?.send(
      JSON.stringify({
        type: "DRAW_UPDATE",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
        offsetX: e.nativeEvent.offsetX ? e.nativeEvent.offsetX : e.nativeEvent.touches[0].clientX-50,
        offsetY: e.nativeEvent.offsetY ? e.nativeEvent.offsetY : e.nativeEvent.touches[0].clientY-300
      })
    );
  };

  const updateDrawAuto = (offsetX: number, offsetY: number) => {
    if(!canvasContextReference.current) return;
    canvasContextReference.current.lineTo(offsetX, offsetY);
    canvasContextReference.current.stroke();
  };

  const clearCanvas = () => {
    if(!isDrawable){
      return;
    }

    const canvas = canvasReference.current;

    if(!canvas) return;
    const context = canvas.getContext("2d");

    if(!context) return;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    socket?.send(
      JSON.stringify({
        type: "DRAW_CLEAR",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ]
      })
    );
    const canvasHis = canvasHistory;

    if(!canvasReference.current) return;
    canvasHis.push(canvasReference.current.toDataURL());
    console.log(canvasHis);
    setCanvasHistory(canvasHis);
  };

  const clearCanvasForced = () => {
    const canvas = canvasReference.current;

    if(!canvas) return;
    const context = canvas.getContext("2d");

    if(!context) return;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    socket?.send(
      JSON.stringify({
        type: "DRAW_CLEAR",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ]
      })
    );

    const canvasHis = canvasHistory;

    if(!canvasReference.current) return;
    canvasHis.push(canvasReference.current.toDataURL());
    setCanvasHistory(canvasHis);
  }

  const clearCanvasAuto = () => {
    const canvas = canvasReference.current;

    if(!canvas) return;
    const context = canvas.getContext("2d");

    if(!context) return;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const changeStrokeColor = (color: string) => {
    if(!isDrawable){
      return;
    }
    if(!canvasContextReference.current) return;
    canvasContextReference.current.strokeStyle = color;

    socket?.send(
      JSON.stringify({
        type: "DRAW_CHANGE_COLOR",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
        color: color  
      })
    );
  };

  const changeStrokeColorAuto = (color: string) => {
    if(!canvasContextReference.current) return;
    canvasContextReference.current.strokeStyle = color;
  };

  const eraseCanvas = () => {
    if(!isDrawable){
      return;
    }

    if(!canvasContextReference.current) return;
    canvasContextReference.current.strokeStyle = 'white';
    setIsErasing(true);

    socket?.send(
      JSON.stringify({
        type: "DRAW_ERASE",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ]
      })
    );
  }

  const eraseCanvasAuto = () => {
    if(!canvasContextReference.current) return;
    canvasContextReference.current.strokeStyle = 'white';
  }

  const undoCanvas = () => {
    if(!isDrawable){
      return;
    }
    const currentCanvasHistory = canvasHistory;
    currentCanvasHistory.pop();
    console.log(currentCanvasHistory[currentCanvasHistory.length-1]);

    const image = new Image();
    image.src = currentCanvasHistory[currentCanvasHistory.length-1];
    
    image.onload = () => {
      const canvas = canvasReference.current;
      if(!canvas) return;
      const context = canvas.getContext("2d");
      if(!context) return;
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      // console.log(image);
    };
    setCanvasHistory(currentCanvasHistory);

    socket?.send(
      JSON.stringify({
        type: "DRAW_UNDO",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
        canvasurl: currentCanvasHistory[currentCanvasHistory.length-1]
      })
    );
  }

  const undoCanvasAuto = (imageURL: string) => {
    const image = new Image();
    image.src = imageURL;
    
    console.log("auto undo: ", imageURL);
    image.onload = () => {
      const canvas = canvasReference.current;
      if(!canvas) return;
      const context = canvas.getContext("2d");
      if(!context) return;
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  }

  useEffect(()=>{
    const canvasHis = canvasHistory;
    // console.log(canvasReference.current.toDataURL());
    if(canvasHis.length<1){
      if(canvasReference.current){
        canvasHis.push(canvasReference.current.toDataURL());
      }
    }
    setCanvasHistory(canvasHis);
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // console.log(message);
      if (message.type === "GAME_STARTED_BY_OWNER") {
        console.log("game start navs");
        navigate(`/game/play/${message.gameId}`);
        // getAllPlayersWithScore();
      } else if (message.type === "GET_ALL_PLAYERS") {
        console.log("setting players");
        setPlayers(message.players);
      } else if (message.type === "GIVEN_WORDS_TO_CHOOSE") {
        clearCanvasForced();
        setWordList(message.words);
        setRound(message.round);
        // getAllPlayersWithScore();
        StartChooseTimer();
        setIsChoosing(true);
      } else if (message.type === "CORRECT_GUESS") {
        console.log(message);
        setScore((score) => Math.floor(score + parseInt(message.score)));
        setIsGuessing(false);
        const allGuessesMade: allGuessesInterface[] = allGuesses;
        const requiredGuess: allGuessesInterface | undefined = allGuessesMade.find((guess)=> guess.guess === message.word);
        if(requiredGuess) requiredGuess.correct = true;
        setAllGuesses(allGuessesMade);
        setTimerCount(180);
        times = -1;
        // getAllPlayersWithScore();
      } else if (message.type === "GAME_OVER") {
        setIsGameOver(true);
        setWinner(message.winner);
      } else if (message.type === "START_GUESSING") {
        setTimer(new Date());
        console.log(message.word);
        // setWordToGuess(message.word);
        wordToGuess = message.word;
        setHintWord(hintWord.padStart(message.word.length, "_"));
        StartGuessTimer();
        setIsGuessing(true);
      } else if (message.type === "DRAW_BEGIN") {
        beginDrawAuto(message.offsetX, message.offsetY);
      } else if (message.type === "DRAW_UPDATE") {
        updateDrawAuto(message.offsetX, message.offsetY);
      } else if (message.type === "DRAW_END") {
        endDrawAuto();
      } else if(message.type === "DRAW_CLEAR"){
        clearCanvasAuto();
      } else if(message.type === "DRAW_CHANGE_COLOR"){
        changeStrokeColorAuto(message.color);
      } else if(message.type === "GET_ALL_PLAYERS_WITH_SCORE"){
        console.log(message);
        setAllPlayersWithScore(message.allPlayersWithScore);
        // setWordToGuess(null);
        wordToGuess = '';
        setChoosenWord('');
      } else if(message.type === "ADD_GUESS_TO_CHAT"){
        console.log(message);
        const allGuessesMade: allGuessesInterface[] = allGuesses;
        allGuessesMade.push({
          guess: message.guess,
          correct: message.correct
        });
        setAllGuesses(allGuessesMade);
      } else if(message.type === 'WORD_CHOOSEN_AUTOMATICALLY'){
        setWordList([]);
        setChoosenWord(message.choosenWord);
        StartDrawTimer();
        setIsDrawable(true);
      } else if(message.type === 'DRAW_ERASE'){
        eraseCanvasAuto();
      } else if(message.type === 'DRAW_UNDO'){
        console.log(message);
        undoCanvasAuto(message.canvasurl);
      } else if(message.type === 'ALL_PLAYERS_GUESSED_CORRECTLY'){
        times = -1;
        drawTimes = -1;
        setDrawTimerCount(180);
        setTimerCount(180);
        setIsGuessing(false);
        setIsDrawable(false);
      } else {
        setRoomCode(message.game_id);
        navigate(`/game/${message.game_id}`);
      }
    };
  }, [socket, navigate]);

  return (
    <AppContext.Provider
      value={{
        players,
        setPlayers,
        wordlist,
        setWordList,
        round,
        setRound,
        createNewGame,
        joinGame,
        guessWord,
        chooseWord,
        roomCode,
        setRoomCode,
        startGame,
        score,
        isGameOver,
        winner,
        timerCount,
        chooseTimerCount,
        drawTimerCount,
        isChoosing,
        isGuessing,
        beginDraw,
        beginDrawTouch,
        updateDraw,
        updateDrawTouch,
        endDraw,
        clearCanvas,
        changeStrokeColor,
        canvasContextReference,
        canvasReference,
        isDrawable,
        allPlayersWithScore,
        allGuesses,
        choosenWord,
        hintWord,
        eraseCanvas,
        isErasing,
        undoCanvas
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;