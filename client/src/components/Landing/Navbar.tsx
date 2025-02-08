import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="px-4 md:px-24 py-3 bg-[#ABF600] w-full relative">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-2 w-[40%] md:w-[30%]">
          <Link to={'/'} className="text-white font-bold text-2xl">
            <img src="./sketchslam-logo-white.png" alt="logo" className='w-40' />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-[#9FE500] rounded-lg transition-colors"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-gray-800" />
          ) : (
            <Menu className="w-6 h-6 text-gray-800" />
          )}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/create-room" className="text-gray-600 hover:text-gray-900">Create room</Link>
          <Link to="/join-room" className="text-gray-600 hover:text-gray-900">Join  room</Link>
          <Link to="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          <button className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors" onClick={() => navigate('/create-room')}>
            Play Game
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`
        absolute top-full left-0 right-0 
        bg-[#ABF600] 
        md:hidden 
        transition-all duration-300 ease-in-out
        ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        shadow-lg
        z-50
      `}>
        <div className="flex flex-col px-4 py-4 gap-4">
          <Link to="/create-room" className="text-gray-600 hover:text-gray-900 py-2 px-4 hover:bg-[#9FE500] rounded-lg transition-colors">
            Create room
          </Link>
          <Link to="/join-room" className="text-gray-600 hover:text-gray-900 py-2 px-4 hover:bg-[#9FE500] rounded-lg transition-colors">
            Join  room
          </Link>
          <Link to="/features" className="text-gray-600 hover:text-gray-900 py-2 px-4 hover:bg-[#9FE500] rounded-lg transition-colors">
            Features
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900 py-2 px-4 hover:bg-[#9FE500] rounded-lg transition-colors">
            About
          </Link>
          <button className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors w-full">
            Play Game
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;