import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GetContext } from "../context/ContextProvider";
import { CreateRoomFormData } from '../lib/types';

function CreateRoom() {
  const context = GetContext();
  const { createNewGame } = context;

  const [formData, setFormData] = useState<CreateRoomFormData>({
    username: '',
    rounds: 3,
    maxPlayers: 4
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNewGame(formData)
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
            <h2 className="text-xl font-semibold mb-1">Create Room</h2>
            <p className="text-gray-500 text-sm">Set up your game room</p>
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

          {/* Game settings */}
          <div className="flex gap-4">
            <select
              value={formData.rounds}
              onChange={(e) => setFormData({ ...formData, rounds: Number(e.target.value) })}
              className="flex-1 px-6 py-3 bg-[#f3fae7] rounded-2xl border-2 border-transparent border-[#d3e5b5] focus:border-[#92d02e] outline-none transition-colors text-center appearance-none"
            >
              {[3, 5, 7, 10].map(num => (
                <option key={num} value={num}>{num} rounds</option>
              ))}
            </select>

            <select
              value={formData.maxPlayers}
              onChange={(e) => setFormData({ ...formData, maxPlayers: Number(e.target.value) })}
              className="flex-1 px-6 py-3 bg-[#f3fae7] rounded-2xl border-2 border-transparent border-[#d3e5b5] focus:border-[#92d02e] outline-none transition-colors text-center appearance-none"
            >
              {[2, 3, 4, 5, 6, 8].map(num => (
                <option key={num} value={num}>{num} players</option>
              ))}
            </select>
          </div>

          {/* Create Room button */}
          <button
            type="submit"
            className="w-full bg-[#ABF600] text-black py-2 rounded-3xl font-medium transition-all duration-200 border-2 border-black hover:shadow-[0_6px_0px_0px_rgba(25,26,35,1)]"
          >
            Create Room
          </button>
        </form>

        {/* Info message */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Room code will be generated automatically</p>
        </div>
      </div>

      <span className='mt-5'>
        Or, <Link to={'/join-room'} className='text-[#516c14] cursor-pointer font-semibold hover:underline'>Join Room</Link>
      </span>
    </div>
  );
}

export default CreateRoom;