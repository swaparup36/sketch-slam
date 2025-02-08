import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Hero () {
  const navigate = useNavigate();

  return (
    <div 
      className="px-2 md:px-6 pt-5 md:pt-20 pb-10 w-full h-[70svh] md:h-[92svh]"
    >
        <div className="flex justify-between items-center gap-12 px-6 md:px-40 pt-10 relative z-10">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <div className="inline-block px-4 py-2 bg-[#f2ffdd] text-[#a5db26] rounded-full text-sm font-medium mb-6">
              A SOCIAL DRAWING GAME
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Connect & draw<br />
              with friends
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Create rooms, draw words, and compete with friends in this exciting multiplayer guessing game.
            </p>
            <div className="flex items-center gap-4">
              <button 
                className="bg-black text-white px-8 py-4 rounded-full font-medium flex items-center gap-2 hover:gap-3 transition-all"
                onClick={() => navigate('/create-room')}
              >
                Play Game
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Content - Stats and Images */}
          <div className="flex-1 relative justify-end md:block hidden">
            <img src="/hero-img.svg" alt="" className='ml-10' />
          </div>
        </div>
      </div>
  )
}

export default Hero;