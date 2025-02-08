import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { JoinRoomFormData } from '../lib/types';
import { GetContext } from '../context/ContextProvider';



function JoinRoom() {
  const context = GetContext();
  const { joinGame } = context;

  const [formData, setFormData] = useState<JoinRoomFormData>({
    username: '',
    roomcode: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    joinGame(formData);
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#fffde7]">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md relative">
        {/* Profile section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-[#f3fae7] rounded-full mb-4 flex items-center justify-center">
            <span className="text-2xl">🎨</span>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-1">Join Room</h2>
            <p className="text-gray-500 text-sm">join a game room</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username input */}
          <div>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-6 py-3 bg-[#f3fae7] rounded-2xl border-2 border-[#d3e5b5] focus:border-[#92d02e] outline-none transition-colors text-center"
              placeholder="Enter username"
              required
            />
          </div>

          {/* Roomcode input */}
          <div>
            <input
              type="text"
              value={formData.roomcode}
              onChange={(e) => setFormData({ ...formData, roomcode: e.target.value })}
              className="w-full px-6 py-3 bg-[#f3fae7] rounded-2xl border-2 border-[#d3e5b5] focus:border-[#92d02e] outline-none transition-colors text-center"
              placeholder="Enter Roomcode"
              required
            />
          </div>         

          {/* Create Room button */}
          <button
            type="submit"
            className="w-full bg-[#ABF600] text-black py-2 rounded-3xl font-medium transition-all duration-200 border-2 border-black hover:shadow-[0_6px_0px_0px_rgba(25,26,35,1)]"
          >
            Join Room
          </button>
        </form>

        {/* Info message */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Enter the room code to join the game room</p>
        </div>
      </div>

      <span className='mt-5'>
        Or, <Link to={'/create-room'} className='text-[#516c14] cursor-pointer font-semibold hover:underline'>Create Room</Link>
      </span>
    </div>
  );
}

export default JoinRoom;