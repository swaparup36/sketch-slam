import { Users, Play, Crown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetContext } from '../context/ContextProvider';
import { AVATARS } from '../lib/avatars';


function Lobby() {
    const { gameid } = useParams();
    const navigate = useNavigate();

    const context = GetContext();
    const { thisUser, setThisUser, players, changeAvatar, creator } = context;


    const handleAvatarSelect = (avatar: string) => {
        if(!thisUser) return navigate('/create-room');
        console.log(avatar);
        changeAvatar(avatar);
        setThisUser({ ...thisUser, avatar: avatar });
    };

    const handleStartGame = () => {
        navigate(`/game/${gameid}`);
        console.log('Starting game...');
    };

    return (
        <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-3xl">
            {/* Header */}
            <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Game Lobby</h2>
            <div className="bg-[#f3fae7] rounded-xl px-4 py-2 inline-block">
                <p className="text-sm font-medium">Room Code: <span className="font-bold">{gameid}</span></p>
            </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Players List */}
            <div className="bg-[#f3fae7] rounded-2xl py-6">
                <div className="flex items-center gap-2 mb-4 px-6">
                    <Users className="w-5 h-5" />
                    <h3 className="font-semibold">Players</h3>
                </div>
                <div className="space-y-3 px-6 max-h-[50svh] overflow-y-scroll">
                    {players.map((player, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-white rounded-xl p-3"
                        >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{player.avatar}</span>
                            <span className="font-medium">{player.username}</span>
                            {creator === player.username && (
                                <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                        </div>
                        {/* <div className={`px-3 py-1 rounded-full text-sm ${
                            player.isReady 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                            {player.isReady ? 'Ready' : 'Not Ready'}
                        </div> */}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column - Avatar Selection */}
            <div>
                <div className="bg-[#f3fae7] rounded-2xl p-6 mb-6">
                <h3 className="font-semibold mb-4">Choose Your Avatar</h3>
                <div className="grid grid-cols-6 gap-2">
                    {AVATARS.map(avatar => (
                        <button
                            key={avatar}
                            onClick={() => handleAvatarSelect(avatar)}
                            className={`text-2xl p-2 rounded-xl transition-all ${
                            thisUser?.avatar === avatar
                                ? 'bg-white shadow-md scale-110'
                                : 'hover:bg-white hover:scale-105'
                            }`}
                        >
                            {avatar}
                        </button>
                    ))}
                </div>
                </div>

                {/* Start Game Button (only visible to host) */}
                {creator === thisUser?.username && (
                    <button
                        onClick={handleStartGame}
                        className='w-full py-3 rounded-2xl transition-all duration-200 border-2 font-medium flex items-center justify-center gap-2 bg-[#ABF600] text-black border-black hover:shadow-[0_6px_0px_0px_rgba(25,26,35,1)]'
                    >
                        <Play className="w-5 h-5" />
                        Start Game
                    </button>
                )}
            </div>
            </div>

            {/* Bottom Info */}
            <div className="mt-6 text-center text-sm text-gray-500">
            <p>Waiting for all players to be ready...</p>
            </div>
        </div>
        </div>
    );
}

export default Lobby;