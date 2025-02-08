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
import { CreateRoomFormData, JoinRoomFormData, Player } from "../lib/types";
import { colorsMatch, getColorAtPixel, hexToRgba, setColorAtPixel } from "../utils/fillShape";

export interface winnerInterface {
  winner: Player;
  score: number;
}

export interface allPlayersWithScoreInterface {
  user: Player;
  score: number;
}

export interface allGuessesInterface {
  username: string | null;
  guess: string;
  correct: boolean;
}

type appContextProviderProps = {
  children: ReactNode;
};

export interface appContext {
  players: Player[];
  setPlayers: Dispatch<SetStateAction<Player[]>>;
  wordlist: string[];
  setWordList: Dispatch<SetStateAction<string[]>>;
  round: number;
  setRound: Dispatch<SetStateAction<number>>;
  createNewGame: ({username, rounds, maxPlayers}: CreateRoomFormData) => void;
  joinGame: ({ username, roomcode }: JoinRoomFormData) => void;
  changeAvatar: (avatar: string) => void;
  guessWord: (guess: string) => void;
  chooseWord: (word: string) => void;
  roomCode: string;
  setRoomCode: Dispatch<SetStateAction<string>>;
  strokeColor: string;
  setStrokColor: Dispatch<SetStateAction<string>>;
  fillColor: string;
  setFillColor: Dispatch<SetStateAction<string>>;
  thisUser: Player | undefined;
  setThisUser: Dispatch<SetStateAction<Player | undefined>>;
  choosingPlayer: Player | undefined;
  setChoosingPlayer: Dispatch<SetStateAction<Player | undefined>>;
  isAnotherChoosing: boolean;
  setIsAnotherChoosing: Dispatch<SetStateAction<boolean>>;
  creator: string;
  setCreator: Dispatch<SetStateAction<string>>;
  startGame: () => void;
  deleteGame: () => void;
  score: number;
  isGameOver: boolean;
  winner: winnerInterface | null;
  timerCount: number;
  chooseTimerCount: number;
  drawTimerCount: number;
  isChoosing: boolean;
  isGuessing: boolean;
  beginDraw: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  beginDrawTouch: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  updateDraw: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  handleCanvasClick: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
  updateDrawTouch: TouchEventHandler<HTMLCanvasElement>;
  endDraw: () => void;
  clearCanvas: () => void;
  changeStrokeColor: (color: string) => void;
  changeFillColor: (color: string) => void;
  canvasReference: React.RefObject<HTMLCanvasElement> | null;
  chatDivRef: React.RefObject<HTMLDivElement> | null;
  isDrawable: boolean;
  allPlayersWithScore: allPlayersWithScoreInterface[];
  allGuesses: allGuessesInterface[];
  choosenWord: string;
  hintWord: string;
  eraseCanvas: () => void;
  isErasing: boolean;
  isFilling: boolean;
  setIsFilling: Dispatch<SetStateAction<boolean>>;
  undoCanvas: () => void;
}

const defaultState = {
  players: [],
  setPlayers: (players: Player[]) => {
    console.log(players);
  },
  wordlist: [],
  setWordList: (wordlist: string[]) => {
    console.log(wordlist);
  },
  round: 0,
  setRound: (round: number) => {
    console.log(round);
  },
  creator: '',
  setCreator: (creator: string) => {
    console.log(creator);
  },
  createNewGame: ({username, rounds, maxPlayers}: CreateRoomFormData) => {
    console.log(username);
    console.log(rounds);
    console.log(maxPlayers);
  },
  joinGame: ({ username, roomcode }: JoinRoomFormData) => {
    console.log(username);
    console.log(roomcode);
  },
  changeAvatar: (avatar: string) => {
    console.log(avatar);
  },
  guessWord: (guess: string) => {
    console.log(guess);
  },
  chooseWord: (word: string) => {
    console.log(word);
  },
  roomCode: "",
  setRoomCode: (roomCode: string) => {
    console.log(roomCode);
  },
  strokeColor: "",
  setStrokColor: (color: string) => {
    console.log(color);
  },
  fillColor: "",
  setFillColor: (fillColor: string) => {
    console.log(fillColor);
  },
  thisUser: { avatar: '', username: '' },
  setThisUser: (thisUser: Player) => {
    console.log(thisUser);
  },
  choosingPlayer: { avatar: '', username: '' },
  setChoosingPlayer: (player: Player) => {
    console.log(player);
  },
  isAnotherChoosing: false,
  setIsAnotherChoosing: (isAnotherChoosing: boolean) => {
    console.log(isAnotherChoosing);
  },
  startGame: () => {},
  deleteGame: () => {},
  score: 0,
  isGameOver: false,
  winner: null,
  timerCount: 180,
  chooseTimerCount: 30,
  drawTimerCount: 180,
  isChoosing: false,
  isGuessing: false,
  // isWordChosenAuto: false,
  // setIsWordChosenAuto: (isWordChosenAuto: boolean) => {console.log(isWordChosenAuto)},
  beginDraw: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    console.log(e);
  },
  beginDrawTouch: (e: React.TouchEvent<HTMLCanvasElement>) => {
    console.log(e);
  },
  updateDraw: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    console.log(e);
  },
  handleCanvasClick: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    console.log(e);
  },
  updateDrawTouch: (event) => {
    console.log(event);
  },
  endDraw: () => {},
  clearCanvas: () => {},
  changeStrokeColor: (color: string) => {
    console.log(color);
  },
  changeFillColor: (color: string) => {
    console.log(color);
  },
  // canvasContextReference: useRef<CanvasRenderingContext2D>(null),
  canvasReference: null,
  chatDivRef: null,
  isDrawable: false,
  isFilling: false,
  setIsFilling: (isFilling: boolean) => {
    console.log(isFilling)
  },
  allPlayersWithScore: [],
  allGuesses: [],
  choosenWord: "",
  hintWord: "",
  eraseCanvas: () => {},
  isErasing: false,
  undoCanvas: () => {},
} as appContext;


const AppContext = createContext(defaultState);

export const GetContext = () => {
  return useContext(AppContext);
};

const ContextProvider = ({ children }: appContextProviderProps) => {
  const socket = useSocket();
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
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
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [isDrawable, setIsDrawable] = useState<boolean>(false);
  const [allPlayersWithScore, setAllPlayersWithScore] = useState<
    allPlayersWithScoreInterface[]
  >([]);
  const [allGuesses, setAllGuesses] = useState<allGuessesInterface[]>([]);
  const [choosenWord, setChoosenWord] = useState<string>("");
  const [isErasing, setIsErasing] = useState<boolean>(false);
  let wordToGuess: string = "";
  const [hintWord, setHintWord] = useState<string>("");
  let times = -1;
  let chooseTimes = -1;
  let drawTimes = -1;
  const [strokeColor, setStrokColor] = useState<string>("");
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
  const [thisUser, setThisUser] = useState<Player>();
  const [creator, setCreator] = useState<string>('');
  const [isFilling, setIsFilling] = useState<boolean>(false);
  const [fillColor, setFillColor] = useState<string>("");
  const [choosingPlayer, setChoosingPlayer] = useState<Player>();
  const [isAnotherChoosing, setIsAnotherChoosing] = useState<boolean>(false);
  const chatDivRef = useRef<HTMLDivElement>(null);
  let isAdded: boolean = false;

  const createNewGame = ({username, rounds, maxPlayers}: CreateRoomFormData): void => {
    if (!socket) {
      return console.log("socket not found");
    }
    sessionStorage.setItem("sketchslamusername", username);
    sessionStorage.setItem("sketchslamiscreator", username);
    socket.send(
      JSON.stringify({ type: "START_NEW_GAME", username: username, rounds: rounds, maxPlayers: maxPlayers })
    );
  };

  const joinGame = ({ username, roomcode }: JoinRoomFormData) => {
    if (!socket) {
      return;
    }

    sessionStorage.setItem("sketchslamusername", username);
    socket.send(
      JSON.stringify({
        type: "JOIN_GAME",
        username: username,
        gameId: roomcode,
      })
    );
    navigate(`/lobby/${roomcode}`);
  };

  const startGame = () => {
    if (!socket) {
      alert('Unable to get back the game state');
      window.location.href = 'http://localhost:5173/';
      return console.log("socket is missing");
    }
    socket.send(
      JSON.stringify({
        type: "START_GAME",
        username: sessionStorage.getItem("sketchslamusername"),
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
      })
    );
    console.log("Game start msg sent");
  };

  const deleteGame = () => {
    if (!socket) {
      return;
    }
    socket.send(
      JSON.stringify({
        type: "DELETE_GAME",
        username: sessionStorage.getItem("sketchslamusername"),
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
      })
    );
    console.log("Game delete msg sent");
  };

  const changeAvatar = (avatar: string): void => {
    if (!socket) {
      return console.log("socket not found");
    }

    socket.send(
      JSON.stringify({ 
        type: "CHANGE_AVATAR", 
        avatar: avatar, 
        gameId: window.location.pathname.split("/")[
          window.location.pathname.split("/").length - 1
        ], 
      })
    );
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
        username: sessionStorage.getItem("sketchslamusername"),
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
      username: sessionStorage.getItem("sketchslamusername"),
      guess: guess,
      correct: false,
    });
    setAllGuesses(allGuessesMade);
    if(chatDivRef.current){
      chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
    }
  };

  const chooseWord = (word: string) => {
    if (!socket) {
      return;
    }

    socket.send(
      JSON.stringify({
        type: "WORD_CHOSEN",
        username: sessionStorage.getItem("sketchslamusername"),
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
    times = -1;
    chooseTimes = -1;
    StartDrawTimer();
    setIsDrawable(true);
  };

  const replaceChar = (
    origString: string,
    replaceChar: string,
    index: number
  ): string => {
    const firstPart: string = origString.substr(0, index);

    const lastPart: string = origString.substr(index + 1);

    const newString: string = firstPart + replaceChar + lastPart;

    return newString;
  };

  const StartGuessTimer = () => {
    setTimerCount(180);
    setDrawTimerCount(0);
    setIsDrawable(false);
    times = 180;
    let hintUpdate = "";
    const interval = setInterval(() => {
      times = times - 0.5;
      if (times >= 0) {
        if (times <= 121 && times >= 119) {
          console.log(
            "wordToGuess: ",
            wordToGuess.charAt(wordToGuess.length / 2)
          );
          const hint: string = replaceChar(
            hintWord.padStart(wordToGuess.length, "_"),
            wordToGuess.charAt(wordToGuess.length / 2),
            wordToGuess.length / 2
          );
          hintUpdate = hint;
          console.log("wordToHint: ", hint);
          setHintWord(hint);
        } else if (times <= 61 && times >= 59) {
          const hint: string = replaceChar(
            hintUpdate,
            wordToGuess.charAt(0),
            0
          );
          setHintWord(hint);
        }
        setTimerCount(times);
        // console.log('second: ', times);
      } else {
        setIsGuessing(false);
        console.log("clearing the interval for guess...");
        clearInterval(interval);
        setTimerCount(0);
      }
    }, 1000);
  };

  const StartDrawTimer = () => {
    setDrawTimerCount(180);
    setTimerCount(0);
    setChooseTimerCount(0);
    setIsGuessing(false);
    setIsChoosing(false);
    drawTimes = 180;
    const interval = setInterval(() => {
      drawTimes = drawTimes - 1;

      if (drawTimes >= 0) {
        setDrawTimerCount(drawTimes);
        // console.log('second: ', drawTimes);
      } else {
        console.log("clearing the interval...");
        clearInterval(interval);
        setDrawTimerCount(0);
      }
    }, 1000);
    setIsDrawable(false);
  };

  const StartDrawTimerAutoChosen = () => {
    setDrawTimerCount(180);
    setTimerCount(0);
    setChooseTimerCount(0);
    setIsGuessing(false);
    setIsChoosing(false);
    drawTimes = 180;
    const interval = setInterval(() => {
      drawTimes = drawTimes - 0.5;
      console.log("choosen auto");

      if (drawTimes >= 0) {
        setDrawTimerCount(drawTimes);
        // console.log('second: ', drawTimes);
      } else {
        console.log("clearing the interval...");
        clearInterval(interval);
        setDrawTimerCount(0);
      }
    }, 1000);
    setIsDrawable(false);
  };

  const StartChooseTimer = () => {
    setChooseTimerCount(30);
    setDrawTimerCount(0);
    setTimerCount(0);
    setIsDrawable(false);
    setIsGuessing(false);
    chooseTimes = 30;
    const interval = setInterval(() => {
      chooseTimes = chooseTimes - 0.5;
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

  const changeStrokeColor = (color: string) => {
    if (!isDrawable) {
      return console.log("canvas is not drawable");
    }
    // if(!canvasContextReference.current) return;

    const canvas = canvasReference.current;

    if (!canvas) return console.log("canvas not found");
    const context = canvas.getContext("2d");

    if (!context) return console.log("context not found");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 4;

    // canvasContextReference.current.strokeStyle = color;
    context.strokeStyle = color;

    setStrokColor(color);

    if (!socket) return console.log("socket not found");

    socket.send(
      JSON.stringify({
        type: "DRAW_CHANGE_COLOR",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
        color: color,
      })
    );
  };

  const changeFillColor = (color: string) => {
    if (!isDrawable) {
      return console.log("canvas is not drawable");
    }

    const canvas = canvasReference.current;

    if (!canvas) return console.log("canvas not found");
    const context = canvas.getContext("2d");

    if (!context) return console.log("context not found");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 4;
    context.fillStyle = "white";

    context.fillStyle = color;

    setFillColor(color);

    if (!socket) return console.log("socket not found");

    socket.send(
      JSON.stringify({
        type: "DRAW_CHANGE_FILL_COLOR",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
        color: color,
      })
    );
  };

  const changeStrokeColorAuto = (color: string) => {
    const canvas = canvasReference.current;

    if (!canvas) return console.log("canvas not found");
    const context = canvas.getContext("2d");

    if (!context) return console.log("context not found");

    console.log("color changed to: ", color);
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = 4;

    console.log("current strokestyle: ", context.strokeStyle);

    setStrokColor(color);
    console.log("state stroke color: ", color);
  };

  const changeFillColorAuto = (color: string) => {
    const canvas = canvasReference.current;

    if (!canvas) return console.log("canvas not found");
    const context = canvas.getContext("2d");

    if (!context) return console.log("context not found");

    console.log("color changed to: ", color);
    context.lineCap = "round";
    context.strokeStyle = strokeColor;
    context.lineWidth = 4;
    context.fillStyle = color;

    console.log("current fillstyle: ", context.fillStyle);

    setFillColor(color);
    console.log("state fill color: ", color);
  };

  const eraseCanvas = () => {
    if (!isDrawable) {
      return;
    }

    // if(!canvasContextReference.current) return;
    const canvas = canvasReference.current;

    if (!canvas) return;
    const context = canvas.getContext("2d");

    if (!context) return;
    context.lineCap = "round";
    context.strokeStyle = "white";
    context.lineWidth = 10;

    setStrokColor("white");
    setFillColor("#ffffff");

    // canvasContextReference.current.strokeStyle = 'white';

    setIsErasing(true);

    socket?.send(
      JSON.stringify({
        type: "DRAW_ERASE",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
      })
    );
  };

  const eraseCanvasAuto = () => {
    // if(!canvasContextReference.current) return;

    const canvas = canvasReference.current;

    if (!canvas) return;
    const context = canvas.getContext("2d");

    if (!context) return;
    context.lineCap = "round";
    context.strokeStyle = "white";
    context.lineWidth = 10;

    setStrokColor("white");
    setFillColor("#ffffff");

    // canvasContextReference.current.strokeStyle = 'white';
  };

  const undoCanvas = () => {
    if (!isDrawable) {
      return;
    }
    const currentCanvasHistory = canvasHistory;
    currentCanvasHistory.pop();
    console.log(currentCanvasHistory[currentCanvasHistory.length - 1]);

    const image = new Image();
    image.src = currentCanvasHistory[currentCanvasHistory.length - 1];

    image.onload = () => {
      const canvas = canvasReference.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) return;
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
        canvasurl: currentCanvasHistory[currentCanvasHistory.length - 1],
      })
    );
  };

  const fillColorFunc = (x: number, y: number) => {
    const canvas = canvasReference.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelStack = [[x, y]];
    const targetColor = getColorAtPixel(imageData, x, y);
    
    console.log("current fill color: ", fillColor);
    const fill_color = hexToRgba(fillColor);
  
    if (colorsMatch(targetColor, fill_color)) return;
  
    while (pixelStack.length > 0) {
      const currentPixel = pixelStack.pop();
      if (!currentPixel) continue;

      const [currentX, currentY] = currentPixel;
  
      if (
        currentX >= 0 &&
        currentX < canvas.width &&
        currentY >= 0 &&
        currentY < canvas.height &&
        colorsMatch(getColorAtPixel(imageData, currentX, currentY), targetColor)
      ) {
        setColorAtPixel(imageData, currentX, currentY, fill_color);
  
        pixelStack.push([currentX + 1, currentY]);
        pixelStack.push([currentX - 1, currentY]);
        pixelStack.push([currentX, currentY + 1]);
        pixelStack.push([currentX, currentY - 1]);
      }
    }
  
    ctx.putImageData(imageData, 0, 0);
  };

  const fillColorFuncAuto = (x: number, y: number, color: string) => {
    const canvas = canvasReference.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelStack = [[x, y]];
    const targetColor = getColorAtPixel(imageData, x, y);
    console.log("current fill color: ", color);
    const fill_color = hexToRgba(color);
  
    if (colorsMatch(targetColor, fill_color)) return;
  
    while (pixelStack.length > 0) {
      const currentPixel = pixelStack.pop();
      if (!currentPixel) continue;

      const [currentX, currentY] = currentPixel;

      if (
        currentX >= 0 &&
        currentX < canvas.width &&
        currentY >= 0 &&
        currentY < canvas.height &&
        colorsMatch(getColorAtPixel(imageData, currentX, currentY), targetColor)
      ) {
        setColorAtPixel(imageData, currentX, currentY, fill_color);
  
        pixelStack.push([currentX + 1, currentY]);
        pixelStack.push([currentX - 1, currentY]);
        pixelStack.push([currentX, currentY + 1]);
        pixelStack.push([currentX, currentY - 1]);
      }
    }
  
    ctx.putImageData(imageData, 0, 0);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawable) {
      return;
    }

    if(!isFilling) {
      return;
    }

    const canvas = canvasReference.current;

    if(!canvas) return;

    const rect = canvas.getBoundingClientRect();

    let x: number, y: number;

    if (event.nativeEvent instanceof MouseEvent) {
      x = event.nativeEvent.offsetX;
      y = event.nativeEvent.offsetY;
      fillColorFunc(x, y);

      socket?.send(
        JSON.stringify({
          type: "DRAW_FILL",
          gameId:
            window.location.pathname.split("/")[
              window.location.pathname.split("/").length - 1
            ],
          clientX: x,
          clientY: y,
          color: fillColor
        })
      );
    }

    // For touch
    else if (event.nativeEvent instanceof TouchEvent) {
      const touch = event.nativeEvent.touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;

      fillColorFunc(x, y);

      socket?.send(
        JSON.stringify({
          type: "DRAW_FILL",
          gameId:
            window.location.pathname.split("/")[
              window.location.pathname.split("/").length - 1
            ],
          clientX: x,
          clientY: y,
          color: fillColor
        })
      );
    } else {
      return;
    }
  };

  const handleCanvasClickAuto = (x: number, y: number, color: string) => {
    fillColorFuncAuto(x, y, color);
  };

  const beginDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawable) {
      return;
    }

    if(isFilling) {
      return;
    }

    const canvas = canvasReference.current;

    if (!canvas) return;
    const context = canvas.getContext("2d");

    if (!context) return;
    context.lineCap = "round";
    context.strokeStyle = strokeColor;
    context.lineWidth = 4;

    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    setIsPressed(true);

    socket?.send(
      JSON.stringify({
        type: "DRAW_BEGIN",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY,
      })
    );
  };

  const beginDrawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawable) {
      return;
    }


    const canvas = canvasReference.current;

    if (!canvas) return;
    const context = canvas.getContext("2d");

    if (!context) return;
    context.lineCap = "round";
    context.strokeStyle = strokeColor;
    context.lineWidth = 4;

    const rect = canvas.getBoundingClientRect();
    context.beginPath();
    context.moveTo(
      e.nativeEvent.touches[0].clientX - rect.left,
      e.nativeEvent.touches[0].clientY - rect.top
    );
    setIsPressed(true);

    socket?.send(
      JSON.stringify({
        type: "DRAW_BEGIN",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
        offsetX: e.nativeEvent.touches[0].clientX - rect.left,
        offsetY: e.nativeEvent.touches[0].clientY - rect.top,
      })
    );
  };

  const beginDrawAuto = (offsetX: number, offsetY: number) => {
    console.log("begin offsets: ", offsetX, " ", offsetY);

    const canvas = canvasReference.current;

    if (!canvas) return;
    const context = canvas.getContext("2d");

    console.log("stroke color from begin draw: ", strokeColor);
    if (!context) return;
    context.lineCap = "round";
    context.strokeStyle = strokeColor;
    context.lineWidth = 4;

    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsPressed(true);
  };

  const endDraw = () => {
    if (!isDrawable) {
      return;
    }

    // if(!canvasContextReference.current) return;

    const canvas = canvasReference.current;

    if (!canvas) return;
    const context = canvas.getContext("2d");

    if (!context) return;
    context.lineCap = "round";
    context.strokeStyle = strokeColor;
    context.lineWidth = 4;

    // canvasContextReference.current.closePath();
    context.closePath();
    setIsPressed(false);

    socket?.send(
      JSON.stringify({
        type: "DRAW_END",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
      })
    );

    const canvasHis = canvasHistory;
    if (!canvasReference.current) return;
    canvasHis.push(canvasReference.current.toDataURL());
    console.log(canvasHis);
    setCanvasHistory(canvasHis);
  };

  const endDrawAuto = () => {
    // if(!canvasContextReference.current) return;

    const canvas = canvasReference.current;

    if (!canvas) return;
    const context = canvas.getContext("2d");

    if (!context) return;
    context.lineCap = "round";
    context.strokeStyle = strokeColor;
    context.lineWidth = 4;

    // canvasContextReference.current.closePath();

    context.closePath();
    setIsPressed(false);
  };

  const updateDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawable) {
      return;
    }

    if (!isPressed) {
      return;
    }

    if(isFilling) {
      return;
    }

    // if(!canvasContextReference.current) return;

    const canvas = canvasReference.current;

    if (!canvas) return;
    const context = canvas.getContext("2d");

    if (!context) return;
    context.lineCap = "round";
    context.strokeStyle = strokeColor;
    context.lineWidth = 4;


    // console.log("from update: ", e.clientX, " ", e.clientY);
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();

    socket?.send(
      JSON.stringify({
        type: "DRAW_UPDATE",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY,
      })
    );
  };

  const updateDrawTouch: React.TouchEventHandler<HTMLCanvasElement> = (e) => {
    if (!isDrawable) {
      return;
    }

    if (!isPressed) {
      return;
    }

    const canvas = canvasReference.current;

    if (!canvas) return;
    const context = canvas.getContext("2d");

    if (!context) return;
    context.lineCap = "round";
    context.strokeStyle = strokeColor;
    context.lineWidth = 4;

    const rect = canvas.getBoundingClientRect();
    context.lineTo(
      e.nativeEvent.touches[0].clientX - rect.left,
      e.nativeEvent.touches[0].clientY - rect.top
    );
    context.stroke();

    socket?.send(
      JSON.stringify({
        type: "DRAW_UPDATE",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
        offsetX: e.nativeEvent.touches[0].clientX - rect.left,
        offsetY: e.nativeEvent.touches[0].clientY - rect.top,
      })
    );
  };

  const updateDrawAuto = (offsetX: number, offsetY: number) => {
    const canvas = canvasReference.current;

    if (!canvas) return;
    const context = canvas.getContext("2d");

    if (!context) return;
    context.lineCap = "round";
    context.strokeStyle = strokeColor;
    context.lineWidth = 4;

    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const clearCanvas = () => {
    if (!isDrawable) {
      return;
    }

    const canvas = canvasReference.current;

    if (!canvas) return;
    const context = canvas.getContext("2d");

    if (!context) return;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    socket?.send(
      JSON.stringify({
        type: "DRAW_CLEAR",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
      })
    );
    const canvasHis = canvasHistory;

    if (!canvasReference.current) return;
    canvasHis.push(canvasReference.current.toDataURL());
    console.log(canvasHis);
    setCanvasHistory(canvasHis);
  };

  const clearCanvasForced = () => {
    const canvas = canvasReference.current;

    if (!canvas) return;
    const context = canvas.getContext("2d");

    if (!context) return;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    socket?.send(
      JSON.stringify({
        type: "DRAW_CLEAR",
        gameId:
          window.location.pathname.split("/")[
            window.location.pathname.split("/").length - 1
          ],
      })
    );

    const canvasHis = canvasHistory;

    if (!canvasReference.current) return;
    canvasHis.push(canvasReference.current.toDataURL());
    setCanvasHistory(canvasHis);
  };

  const clearCanvasAuto = () => {
    const canvas = canvasReference.current;

    if (!canvas) return;
    const context = canvas.getContext("2d");

    if (!context) return;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const undoCanvasAuto = (imageURL: string) => {
    const image = new Image();
    image.src = imageURL;

    console.log("auto undo: ", imageURL);
    image.onload = () => {
      const canvas = canvasReference.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  };

  useEffect(() => {
    const canvasHis = canvasHistory;
    // console.log(canvasReference.current.toDataURL());
    if (canvasHis.length < 1) {
      if (canvasReference.current) {
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
      if (message.type === "GAME_STARTED_BY_OWNER") {
        console.log("game start navs");
        navigate(`/game/${message.gameId}`);
      } else if (message.type === "GET_ALL_PLAYERS") {
        console.log("all players: ", message.players);
        setPlayers(message.players);
        setCreator(message.creator);
        const selfname = sessionStorage.getItem("sketchslamusername");
        const self = message.players.find((player: Player) => player.username === selfname);
        if(self){
          setThisUser(self);
        }
      } else if (message.type === "GIVEN_WORDS_TO_CHOOSE") {
        clearCanvasForced();
        setWordList(message.words);
        setRound(message.round);
        StartChooseTimer();
        setIsChoosing(true);
        setIsAnotherChoosing(false);
        setIsFilling(false);
        setFillColor('#ffffff');
        setStrokColor('#000000');
      } else if (message.type === "CORRECT_GUESS") {
        times = -1;
        drawTimes = -1;
        console.log(message);
        setScore((score) => Math.floor(score + parseInt(message.score)));
        setIsGuessing(false);
        const allGuessesMade: allGuessesInterface[] = allGuesses;
        const requiredGuess: allGuessesInterface | undefined =
          allGuessesMade.find((guess) => guess.guess === message.word);
        if (requiredGuess) requiredGuess.correct = true;
        setAllGuesses(allGuessesMade);
        if(chatDivRef.current){
          chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
        }
        setTimerCount(180);
      } else if (message.type === "GAME_OVER") {
        setIsGameOver(true);
        setWinner(message.winner);
        setAllPlayersWithScore(message.allPlayersWithScore);
      } else if (message.type === "START_GUESSING") {
        setTimer(new Date());
        wordToGuess = message.word;
        setHintWord(hintWord.padStart(message.word.length, "_"));
        setTimerCount(180);
        StartGuessTimer();
        setIsGuessing(true);
        setIsAnotherChoosing(false);
      } else if (message.type === "DRAW_BEGIN") {
        console.log("drawing auto");
        beginDrawAuto(message.offsetX, message.offsetY);
      } else if (message.type === "DRAW_FILL") {
        console.log("filling auto");
        handleCanvasClickAuto(message.clientX, message.clientY, message.color);
      } else if (message.type === "DRAW_UPDATE") {
        updateDrawAuto(message.offsetX, message.offsetY);
      } else if (message.type === "DRAW_END") {
        endDrawAuto();
      } else if (message.type === "DRAW_CLEAR") {
        clearCanvasAuto();
      } else if (message.type === "DRAW_CHANGE_COLOR") {
        changeStrokeColorAuto(message.color);
      } else if (message.type === "DRAW_CHANGE_FILL_COLOR") {
        console.log("fill color changed: ", message.color);
        changeFillColorAuto(message.color);
      } else if (message.type === "GET_ALL_PLAYERS_WITH_SCORE") {
        console.log("all players with score", message);
        setAllPlayersWithScore(message.allPlayersWithScore);
        wordToGuess = "";
        setChoosenWord("");
      } else if (message.type === "ADD_GUESS_TO_CHAT") {
        console.log(message);
        const allGuessesMade: allGuessesInterface[] = allGuesses;
        if(!isAdded){
          allGuessesMade.push({
            username: message.username,
            guess: message.guess,
            correct: message.correct,
          });
          console.log("updated guesses: ", allGuessesMade);
          setAllGuesses(allGuessesMade);
          isAdded = true;
        }else {
          isAdded = false;
        }
        if(chatDivRef.current){
          chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
        }
      } else if (message.type === "WORD_CHOOSEN_AUTOMATICALLY") {
        setWordList([]);
        setChoosenWord(message.choosenWord);
        setIsChoosing(false);
        chooseTimes = -1;
        StartDrawTimerAutoChosen();
        setIsDrawable(true);
      } else if (message.type === "DRAW_ERASE") {
        eraseCanvasAuto();
      } else if (message.type === "DRAW_UNDO") {
        console.log(message);
        undoCanvasAuto(message.canvasurl);
      } else if (message.type === "ALL_PLAYERS_GUESSED_CORRECTLY") {
        times = -1;
        drawTimes = -1;
        setDrawTimerCount(180);
        setTimerCount(180);
        setIsGuessing(false);
        setIsDrawable(false);
      } else if (message.type === "ANOTHER_PLAYER_IS_CHOOSING") {
        setChoosingPlayer(message.choosingPlayer);
        setIsAnotherChoosing(true);
      } else if(message.type === 'GAME_DOES_NOT_EXIST'){
        window.location.href = 'http://localhost:5173/';
      } else {
        setRoomCode(message.game_id);
        navigate(`/lobby/${message.game_id}`);
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
        thisUser,
        setThisUser,
        creator,
        setCreator,
        createNewGame,
        joinGame,
        changeAvatar,
        guessWord,
        chooseWord,
        roomCode,
        setRoomCode,
        startGame,
        deleteGame,
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
        changeFillColor,
        canvasReference,
        chatDivRef,
        isDrawable,
        allPlayersWithScore,
        allGuesses,
        choosenWord,
        hintWord,
        eraseCanvas,
        isErasing,
        undoCanvas,
        strokeColor,
        setStrokColor,
        fillColor,
        setFillColor,
        handleCanvasClick,
        isFilling,
        setIsFilling,
        choosingPlayer,
        setChoosingPlayer,
        isAnotherChoosing,
        setIsAnotherChoosing
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
