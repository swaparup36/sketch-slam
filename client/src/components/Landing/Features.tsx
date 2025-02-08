import {
  Brush,
  MessageCircle,
  Sparkles,
  Timer,
  Trophy,
  Users,
} from "lucide-react";


function Features () {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-[#f3fae7]">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Why Play With Us?</h2>
                <div className="w-20 h-1 bg-[#d3e5b5] mx-auto rounded-full" />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                {/* Real-time Drawing */}
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="bg-[#f3fae7] w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                    <Brush className="w-7 h-7 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Real-time Drawing</h3>
                    <p className="text-gray-600">
                    Express your creativity with our smooth drawing tools and real-time
                    collaboration features
                    </p>
                </div>

                {/* Multiplayer Fun */}
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="bg-[#f3fae7] w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="w-7 h-7 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Multiplayer Fun</h3>
                    <p className="text-gray-600">
                    Play with friends or make new ones in our vibrant community of artists
                    and guessers
                    </p>
                </div>

                {/* Quick Rounds */}
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="bg-[#f3fae7] w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                    <Timer className="w-7 h-7 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Quick Rounds</h3>
                    <p className="text-gray-600">
                    Fast-paced rounds keep the excitement high and the creativity flowing
                    </p>
                </div>

                {/* Points System */}
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="bg-[#f3fae7] w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                    <Trophy className="w-7 h-7 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Points System</h3>
                    <p className="text-gray-600">
                    Earn points for accurate guesses and artistic skills to climb the
                    leaderboard
                    </p>
                </div>

                {/* Custom Rooms */}
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="bg-[#f3fae7] w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                    <Sparkles className="w-7 h-7 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Custom Rooms</h3>
                    <p className="text-gray-600">
                    Create private rooms to play with friends and customize game settings
                    </p>
                </div>

                {/* Live Chat */}
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="bg-[#f3fae7] w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                    <MessageCircle className="w-7 h-7 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Live Chat</h3>
                    <p className="text-gray-600">
                    Interact with other players through our real-time chat system while
                    guessing
                    </p>
                </div>
                </div>
            </div>
        </section>
    )
}

export default Features;