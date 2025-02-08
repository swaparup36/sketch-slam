import { Pencil, Eye, Clock, Trophy, MessageCircle, Users, Sparkles, Target } from 'lucide-react';
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Footer';

function HowToPlay() {
  const steps = [
    {
      icon: <Users className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Join or Create a Room",
      description: "Start by joining an existing game room or create your own. Invite friends using the room code."
    },
    {
      icon: <Pencil className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Take Turns Drawing",
      description: "When it's your turn, you'll get a word to draw. Use our drawing tools to illustrate it within the time limit."
    },
    {
      icon: <Eye className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Guess Others' Drawings",
      description: "When others are drawing, type your guesses in the chat. Be quick - faster guesses earn more points!"
    },
    {
      icon: <Trophy className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Earn Points",
      description: "Score points by guessing correctly. The faster you guess, the more points you earn."
    }
  ];

  const tips = [
    {
      icon: <Clock className="w-5 h-5 text-gray-700" />,
      title: "Be Quick",
      description: "You have 80 seconds to draw and others have 80 seconds to guess."
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-gray-700" />,
      title: "Keep Guessing",
      description: "You can make multiple guesses, and close guesses might get hints."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-gray-700" />,
      title: "Use Colors Wisely",
      description: "Different colors can help make your drawings clearer and more recognizable."
    },
    {
      icon: <Target className="w-5 h-5 text-gray-700" />,
      title: "Stay Focused",
      description: "Pay attention to other players' guesses - they might help you figure it out!"
    }
  ];

  return (
    <>
        <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-white to-[#f3fae7]">
                <div className="pt-20 pb-16 md:pt-28 md:pb-24 px-4">
                    <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-6">
                        How to Play Sketch Slam
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                        Master the art of drawing and guessing with our simple guide
                    </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {steps.map((step, index) => (
                        <div
                        key={index}
                        className="bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                        <div className="bg-[#f3fae7] w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6">
                            {step.icon}
                        </div>
                        <span className="inline-block px-3 py-1 bg-[#f3fae7] rounded-full text-sm font-medium mb-4">
                            Step {index + 1}
                        </span>
                        <h3 className="text-lg md:text-xl font-semibold mb-3">{step.title}</h3>
                        <p className="text-gray-600 text-sm md:text-base">
                            {step.description}
                        </p>
                        </div>
                    ))}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-20">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Pro Tips</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {tips.map((tip, index) => (
                        <div
                        key={index}
                        className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 flex items-start gap-4"
                        >
                        <div className="bg-[#f3fae7] p-3 rounded-xl flex-shrink-0">
                            {tip.icon}
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">{tip.title}</h3>
                            <p className="text-gray-600 text-sm">{tip.description}</p>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-32">
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center">Example Game Round</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#f3fae7] rounded-2xl p-5">
                        <h3 className="font-semibold mb-3">1. Word Assignment</h3>
                        <p className="text-sm text-gray-600">
                            The drawer gets a word like "elephant" and has 80 seconds to draw it
                        </p>
                        </div>
                        <div className="bg-[#f3fae7] rounded-2xl p-5">
                        <h3 className="font-semibold mb-3">2. Drawing Phase</h3>
                        <p className="text-sm text-gray-600">
                            The drawer uses tools to create their masterpiece while others watch
                        </p>
                        </div>
                        <div className="bg-[#f3fae7] rounded-2xl p-5">
                        <h3 className="font-semibold mb-3">3. Guessing Phase</h3>
                        <p className="text-sm text-gray-600">
                            Players type guesses in chat. First correct guess earns most points!
                        </p>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Ready to Play Banner */}
                <div className="bg-[#ABF600] py-16">
                    <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">
                        Ready to Start Drawing?
                    </h2>
                    <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                        Join a Game
                    </button>
                    </div>
                </div>
            </div>
        <Footer />
    </>
  );
}

export default HowToPlay;