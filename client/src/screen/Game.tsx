import { useEffect, useState } from "react";
import { Eraser, Home, MessageCircle, Share2, Trophy, Undo2, Users } from "lucide-react";
import { GetContext } from "../context/ContextProvider";
import MyTimer from "../components/MyTimer";
import { generateLeaderboardImage } from "../utils/generateLeaderboard";
import uploadImage from "../utils/uploader";
import Modal from "../components/Modal";
import { useModal } from "../hooks/useModal";
import * as dotenv from "dotenv";

dotenv.config();


function Game() {
  const [guess, setGuess] = useState<string>("");
  const [choosenColor, setChoosenColor] = useState<string>("#000000");
  const [choosenFillColor, setChoosenFillColor] = useState<string>("#ffffff");
  const [isColorDropDown, setIsColorDropDown] = useState<boolean>(false);
  const [isFillColorDropDown, setIsFillColorDropDown] = useState<boolean>(false);

  const colorArray: string[] = [
    "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
    "#E6B333", "#3366E6", "#999966", "#809980", "#E6FF80",
    "#1AFF33", "#999933", "#FF3380", "#CCCC00", "#66E64D",
    "#4D80CC", "#FF4D4D", "#99E6E6", "#6666FF", "black"
  ];

  const context = GetContext();
  const {
    wordlist,
    round,
    startGame,
    deleteGame,
    chooseWord,
    guessWord,
    score,
    isGameOver,
    winner,
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
    isDrawable,
    allPlayersWithScore,
    allGuesses,
    choosenWord,
    hintWord,
    eraseCanvas,
    isErasing,
    undoCanvas,
    chatDivRef,
    handleCanvasClick,
    setIsFilling,
    choosingPlayer,
    isAnotherChoosing,
    isFilling
  } = context;

  const [activeTab, setActiveTab] = useState<'chat' | 'leaderboard'>('chat');

  const handleBacktoHome = () => {
    deleteGame();
    window.location.href = import.meta.env.VITE_HOST_NAME;
  }

  const { isOpen, modalConfig, showModal, hideModal } = useModal();

  const handleShareLeaderboeard = async () => {
    if (!allPlayersWithScore) return;

    try {
      // Generate the image
      const { file } = await generateLeaderboardImage(allPlayersWithScore);
      
      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload to Cloudinary using your upload function
      const response = await uploadImage(formData);
      const result = JSON.parse(response);
      
      if (result.success) {
        // Copy to clipboard
        await navigator.clipboard.writeText(result.imageURL);
        
        // alert('Share link copied to clipboard!');
        showModal({
          title: 'Share Leaderboard',
          message: 'Leaderboard image URL copied successfully!',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error sharing results:', error);
      // alert('Failed to share results');
      showModal({
        title: 'Share Leaderboard',
        message: 'Failed to share results',
      });
    }
  }

  useEffect(() => {
    startGame();

    if (!canvasReference) return;
    const canvas = canvasReference.current;

    if (canvas) {
      let canvasWidth, canvasHeight, lineWidth;

      if (window.innerWidth <= 768) { 
        // Mobile devices
        canvasWidth = 350;
        canvasHeight = 400;
        lineWidth = 1;
      } else if (window.innerWidth <= 1024) { 
        // Tablets
        canvasWidth = 700;
        canvasHeight = 350;
        lineWidth = 2;
      } else { 
        // Desktops
        canvasWidth = 900;
        canvasHeight = 400;
        lineWidth = 4;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = lineWidth;
        context.fillStyle = "white";
      }
    }
  }, []);

  if (isGameOver) {
    return (
      <>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            hideModal();
          }}
          title={modalConfig.title}
          message={modalConfig.message}
        />

        <div className="min-h-screen bg-gradient-to-b from-[#f3fae7] to-white flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-3xl shadow-lg p-8 text-center relative overflow-hidden">
              {/* Confetti-like decorative elements */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-[#f3fae7] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50" />
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#e9f5d8] rounded-full translate-x-1/2 -translate-y-1/2 opacity-50" />
              
              {/* Trophy Icon */}
              <div className="mb-6 inline-block bg-[#f3fae7] p-4 rounded-full">
                <Trophy className="w-12 h-12 text-yellow-500" />
              </div>

              <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
              <div className="w-16 h-1 bg-[#d3e5b5] mx-auto mb-6 rounded-full" />

              {/* Winner Info */}
              <div className="bg-[#f3fae7] rounded-2xl p-6 mb-8 border-2 border-black">
                <p className="text-lg text-gray-600 mb-2">Winner</p>
                <p className="text-2xl font-bold mb-2">{winner?.winner.username}</p>
                <div className="flex items-center justify-center gap-2 text-xl">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-mono font-semibold">
                    {winner ? Math.floor(winner.score) : 0} points
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleBacktoHome}
                  className="flex items-center justify-center gap-2 bg-[#f3fae7] border-black hover:shadow-[0_6px_0px_0px_rgba(25,26,35,1)] transition-all duration-200 text-gray-800 px-6 py-3 rounded-xl font-medium border-2"
                >
                  <Home className="w-5 h-5" />
                  Home
                </button>
                <button
                  onClick={() => {
                    handleShareLeaderboeard()
                  }}
                  className="flex items-center justify-center gap-2 bg-[#ABF600] text-black border-black hover:shadow-[0_6px_0px_0px_rgba(25,26,35,1)] transition-all duration-200 px-6 py-3 rounded-xl font-medium border-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            {/* All Players Scoreboard */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold mb-4 text-gray-700">Final Scores</h3>
              <div className="space-y-3">
                {allPlayersWithScore
                  .sort((a, b) => (b.score || 0) - (a.score || 0))
                  .map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 px-4 bg-[#f3fae7] border-2 border-black rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        {player.user.username === winner?.winner.username && <Trophy className="w-4 h-4 text-yellow-500" />}
                        <span className="font-medium">
                          <span className="mr-2">{player.user.avatar}</span>
                          {player.user.username}
                        </span>
                      </div>
                      <span className="font-mono font-medium">
                        {player.score ? Math.floor(player.score) : 0}
                      </span>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#f8f8f8] p-4">
        <div className="max-w-6xl mx-auto mb-4">
          {/* Header with Round and Timer */}
          <div className="flex justify-between items-center mb-4">
            <div className="bg-[#f3fae7] px-6 py-2 rounded-xl">
              <span className="md:text-xl font-semibold">Round: {round + 1}</span>
            </div>
            <div className="bg-[#f3fae7] px-6 py-2 rounded-xl">
              <span className="md:text-xl font-mono font-semibold">
                {isGuessing && <MyTimer expiryTimestamp={new Date(new Date().setSeconds(new Date().getSeconds() + 180))} />}
                {isChoosing && <MyTimer expiryTimestamp={new Date(new Date().setSeconds(new Date().getSeconds() + 30))} />}
                {isDrawable && <MyTimer expiryTimestamp={new Date(new Date().setSeconds(new Date().getSeconds() + 180))} />}
              </span>
            </div>
            <div className="bg-[#f3fae7] px-6 py-2 rounded-xl">
              <span className="md:text-xl font-semibold">Score: {score}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
            {/* Main Game Area */}
            <div className="space-y-6">
              {/* Drawing Canvas */}
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-black">
                <canvas
                  ref={canvasReference}
                  onMouseDown={beginDraw}
                  onMouseMove={updateDraw}
                  onMouseUp={endDraw}
                  onTouchStart={beginDrawTouch}
                  onTouchMove={updateDrawTouch}
                  onTouchEnd={endDraw}
                  onClick={handleCanvasClick}
                  className={`${isErasing ? 'cursor-cell' : isFilling ? 'cursor-pointer' : 'cursor-crosshair'} `}
                />
                <div className="bg-[#f1fddc] p-4 flex items-center justify-between border-t-2 border-black">
                  <div className="flex gap-3">
                    <button 
                      onClick={clearCanvas}
                      className="bg-white hover:bg-gray-50 p-3 rounded-xl transition-colors shadow-sm text-black border-2 border-black"
                    >
                      Clear
                    </button>
                    <button 
                      onClick={undoCanvas}
                      className="bg-white border-2 border-black hover:bg-gray-50 p-3 rounded-xl transition-colors shadow-sm"
                    >
                      <Undo2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={eraseCanvas}
                      className="bg-white hover:bg-gray-50 p-3 rounded-xl transition-colors shadow-sm border-2 border-black"
                    >
                      <Eraser className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex w-[30%] justify-end items-center">
                    {/* Stroke Color Picker */}
                    <div className="relative mr-2">
                      {!isColorDropDown && (
                        <button
                          className="w-8 h-8 rounded-full shadow-sm"
                          style={{ backgroundColor: choosenColor }}
                          onClick={() => isDrawable && setIsColorDropDown(true)}
                        />
                      )}
                      {isColorDropDown && (
                        <div className="absolute bottom-full right-0 mb-2 bg-white p-3 rounded-xl shadow-lg grid grid-cols-5 gap-4 w-[180px]">
                          {colorArray.map((color) => (
                            <button
                              key={color}
                              className={`w-6 h-6 rounded-full shadow-sm transition-transform hover:scale-110 ${choosenColor === color ? 'scale-125' : ''}`}
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                setIsColorDropDown(false);
                                changeStrokeColor(color);
                                setChoosenColor(color);
                                setIsFilling(false);
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Fill Color Picker */}
                    <div className="relative">
                      {!isFillColorDropDown && (
                        <button
                          className="w-8 h-8 rounded-full shadow-sm"
                          style={{ backgroundColor: choosenFillColor }}
                          onClick={() => isDrawable && setIsFillColorDropDown(true)}
                        />
                      )}
                      {isFillColorDropDown && (
                        <div className="absolute bottom-full right-0 mb-2 bg-white p-3 rounded-xl shadow-lg grid grid-cols-5 gap-4 w-[180px]">
                          {colorArray.map((color) => (
                            <button
                              key={color}
                              className={`w-6 h-6 rounded-full shadow-sm transition-transform hover:scale-110 ${choosenFillColor === color ? 'scale-125' : ''}`}
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                setIsFillColorDropDown(false);
                                changeFillColor(color);
                                setChoosenFillColor(color);
                                setIsFilling(true);
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Word Selection */}
              {wordlist.length > 0 && (
                <div className="flex justify-center gap-4">
                  {wordlist.map((word, i) => (
                    <button
                      key={i}
                      onClick={() => chooseWord(word)}
                      className="bg-white hover:bg-gray-50 px-3 md:px-8 py-3 rounded-xl transition-colors shadow-lg md:font-medium"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              )}
              {isAnotherChoosing && (
                <div className="text-center text-lg flex justify-center items-center mt-4 text-gray-700">
                  {choosingPlayer?.username} is choosing a word....
                </div>
              )}
              {choosenWord && (
                <div className="text-center text-lg flex justify-center items-center mt-4 text-gray-700">
                  Selected word: <p className="underline ml-2">{choosenWord}</p>
                </div>
              )}
              {isGuessing && hintWord && (
                <div className="text-center text-lg text-gray-700] mt-4">
                  Hint: <span className="tracking-[10px] ml-2">{hintWord}</span>
                </div>
              )}
            </div>

            <div className="space-y-6 overflow-y-scroll">
              {/* Mobile Tabs - Only visible on mobile */}
              <div className="md:hidden bg-white rounded-3xl shadow-lg p-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                      activeTab === 'chat'
                        ? 'bg-[#f3fae7] text-gray-900'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                      activeTab === 'leaderboard'
                        ? 'bg-[#f3fae7] text-gray-900'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Leaderboard
                  </button>
                </div>
              </div>

              {/* Desktop View - Hidden on mobile */}
              <div className="hidden md:block space-y-6">
                {/* Scoreboard */}
                <div className="bg-white rounded-3xl shadow-lg py-6 px-4">
                  <h3 className="font-semibold mb-4 text-gray-700 px-2">Leaderboard</h3>
                  <div className="space-y-3 max-h-[40svh] overflow-y-scroll px-2">
                    {allPlayersWithScore
                    .sort((a, b) => (b.score || 0) - (a.score || 0))
                    .map((player, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between py-3 px-4 bg-[#f3fae7] rounded-xl ${player.user.username === sessionStorage.getItem('sketchslamusername') ? 'border-2 border-[#ABF600]' : ''}`}
                      >
                        <span className="font-medium">
                          <span className="mr-2">{player.user.avatar}</span>
                          {player.user.username}
                        </span>
                        <span className="font-mono font-medium">
                          {player.score ? Math.floor(player.score) : 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat/Guess Area */}
                <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col h-[400px]">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-2" ref={chatDivRef}>
                    {allGuesses.map((guessItem, index) => (
                      <div
                        key={index}
                        className={`py-2 px-4 rounded-lg ${
                          guessItem.correct 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-[#f3fae7]'
                        }`}
                      >
                        {guessItem.username === sessionStorage.getItem('sketchslamusername') ? 'You' : guessItem.username} {guessItem.username === '' ? "" : ": "} {guessItem.guess}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      placeholder="Type your guess..."
                      className="w-full px-4 py-3 rounded-xl bg-[#f3fae7] border-2 border-transparent focus:border-[#d3e5b5] outline-none transition-colors"
                    />
                    <button
                      onClick={() => {
                        guessWord(guess.toLowerCase());
                        setGuess('');
                      }}
                      className="w-full bg-[#ABF600] text-black border-black hover:shadow-[0_6px_0px_0px_rgba(25,26,35,1)] transition-all duration-200 py-3 rounded-xl font-medium border-2"
                    >
                      Guess
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile View - Only visible on mobile */}
              <div className="md:hidden">
                {activeTab === 'leaderboard' && (
                  <div className="bg-white rounded-3xl shadow-lg py-6 px-4">
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto px-2">
                      {allPlayersWithScore
                      .sort((a, b) => (b.score || 0) - (a.score || 0))
                      .map((player, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between py-3 px-4 bg-[#f3fae7] rounded-xl ${player.user.username === sessionStorage.getItem('sketchslamusername') ? 'border-2 border-[#ABF600]' : ''}`}
                        >
                          <span className="font-medium">
                            <span className="mr-2">{player.user.avatar}</span>
                            {player.user.username}
                          </span>
                          <span className="font-mono font-medium">
                            {player.score ? Math.floor(player.score) : 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'chat' && (
                  <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col h-[60vh]">
                    <div className="flex-1 overflow-y-auto mb-4 space-y-2" ref={chatDivRef}>
                      {allGuesses.map((guessItem, index) => (
                        <div
                          key={index}
                          className={`py-2 px-4 rounded-lg ${
                            guessItem.correct 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-[#f3fae7]'
                          }`}
                        >
                          {guessItem.username === sessionStorage.getItem('sketchslamusername') ? 'You' : guessItem.username} {guessItem.username === '' ? "" : ": "} {guessItem.guess}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3 fixed bottom-0 left-0 w-[90%] mb-2 mx-6 bg-white">
                      <input
                        type="text"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        placeholder="Type your guess..."
                        className="w-full px-4 py-3 rounded-xl bg-[#f3fae7] border-2 border-transparent focus:border-[#d3e5b5] outline-none transition-colors"
                      />
                      <button
                        onClick={() => {
                          guessWord(guess.toLowerCase());
                          setGuess('');
                        }}
                        className="w-full bg-[#ABF600] text-black border-black hover:shadow-[0_6px_0px_0px_rgba(25,26,35,1)] transition-all duration-200 py-3 rounded-xl font-medium border-2"
                      >
                        Guess
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Game;