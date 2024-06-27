import { useEffect, useRef, useState } from "react";
import { GetContext } from "../context/ContextProvider";
import { Eraser, Undo2 } from "lucide-react";

function Game() {
  const [guess, setGuess] = useState<string>("");
  const [choosenColor, setChoosenColor] = useState<string>("black");
  const [isColorDropDown, setIsColorDropDown] = useState<boolean>(false);

  const colorArray: string[] = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#809980",
    "#E6FF80",
    "#1AFF33",
    "#999933",
    "#FF3380",
    "#CCCC00",
    "#66E64D",
    "#4D80CC",
    "#FF4D4D",
    "#99E6E6",
    "#6666FF",
    'black'
  ];

  const context = GetContext();
  const {
    wordlist,
    round,
    startGame,
    chooseWord,
    guessWord,
    score,
    isGameOver,
    winner,
    timerCount,
    chooseTimerCount,
    isChoosing,
    isGuessing,
    beginDraw,
    updateDraw,
    endDraw,
    clearCanvas,
    changeStrokeColor,
    canvasReference,
    canvasContextReference,
    isDrawable,
    allPlayersWithScore,
    allGuesses,
    choosenWord,
    drawTimerCount,
    hintWord,
    eraseCanvas,
    isErasing,
    undoCanvas
  } = context;

  useEffect(() => {
    startGame();
    const canvas = canvasReference.current;
    if (canvas) {
      canvas.width = 600;
      canvas.height = 400;

      const context = canvas.getContext("2d");
      context.lineCap = "round";
      context.strokeStyle = "black";
      context.lineWidth = 4;
      canvasContextReference.current = context;
    }
  }, []);

  return (
    <div>
      {isGameOver && (
        <p>
          Winner is {winner.username} with score: {Math.floor(winner.score)}
        </p>
      )}
      {!isGameOver && (
        <>
          <div className="game-area">
            <div className="canvas-area">
              <h3>Round: {round + 1}</h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  flexDirection: "row",
                }}
              >
                {(isGuessing || isDrawable) && isChoosing && <h3>Timer</h3>}
                {isGuessing && (
                  <h3>{`${Math.floor(timerCount / 60)}:${Math.floor(
                    timerCount - Math.floor(timerCount / 60) * 60
                  )}`}</h3>
                )}
                {isChoosing && (
                  <h3>{`${Math.floor(chooseTimerCount / 60)}:${Math.floor(
                    chooseTimerCount - Math.floor(chooseTimerCount / 60) * 60
                  )}`}</h3>
                )}
                {isDrawable && (
                  <h3>{`${Math.floor(drawTimerCount / 60)}:${Math.floor(
                    drawTimerCount - Math.floor(drawTimerCount / 60) * 60
                  )}`}</h3>
                )}
                <h4>Score: {score}</h4>
              </div>
              <canvas
                ref={canvasReference}
                onMouseDown={beginDraw}
                onMouseMove={updateDraw}
                onMouseUp={endDraw}
                onTouchStart={beginDraw}
                onTouchMove={updateDraw}
                onTouchEnd={endDraw}
                className={`canvas ${isErasing ? 'cursor-eraser' : 'cursor-pencil'}`}
              />
              <div className="controll">
                <button className="clear-button" onClick={clearCanvas}>Clear</button>
                <div className="controll-right">
                  <span onClick={undoCanvas}><Undo2 /></span>
                  <span onClick={eraseCanvas}><Eraser /></span>
                  {
                    !isColorDropDown && 
                    <button
                      className="color-choosen"
                      style={{ backgroundColor: choosenColor }}
                      onClick={() => {
                        if(!isDrawable) return
                        setIsColorDropDown(true)
                      }}
                    ></button>
                  }
                  {
                    isColorDropDown &&
                    <div className="colors">
                      {colorArray.map((color) => {
                        return (
                          <button
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              setIsColorDropDown(false);
                              changeStrokeColor(color);
                              setChoosenColor(color);
                            }}
                          ></button>
                        );
                      })}
                    </div>
                  }
                </div>
              </div>
              <div className="words">
                {wordlist.map((word, i) => {
                  return (
                    <button key={i} onClick={() => chooseWord(word)}>
                      {word}
                    </button>
                  );
                })}
                {<p>{choosenWord}</p>}
                {isGuessing && <p>{hintWord}</p>}
              </div>
            </div>
            <div className="activity-area">
              <div className="leaderboard">
                {allPlayersWithScore.map((playerWithScore) => {
                  return (
                    <span className="leaderboard-item">
                      <p>{playerWithScore.username}</p>
                      <p>
                        {playerWithScore.score
                          ? Math.floor(playerWithScore.score)
                          : 0}
                      </p>
                    </span>
                  );
                })}
              </div>
              <div className="guesses">
                <div className="guess-chat">
                  {allGuesses.map((guessItem) => {
                    return (
                      <span
                        className={`chat ${guessItem.correct ? "correct" : ""}`}
                      >
                        {guessItem.guess}
                      </span>
                    );
                  })}
                </div>
                <div className="guess-input">
                  <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                  />
                  <button onClick={() => guessWord(guess)}>Guess</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Game;
