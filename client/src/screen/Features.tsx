import { Brush, Users, Timer, Trophy, Sparkles, MessageCircle, Palette, Share2, Lock, Zap } from 'lucide-react';
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Footer';

function Features() {
  const features = [
    {
      icon: <Brush className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Real-time Drawing",
      description: "Experience smooth, lag-free drawing with our advanced canvas technology. Perfect for both desktop and mobile devices."
    },
    {
      icon: <Users className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Multiplayer Fun",
      description: "Play with up to 8 players simultaneously. Create private rooms or join public games to meet new friends."
    },
    {
      icon: <Timer className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Quick Rounds",
      description: "Fast-paced 60-second rounds keep the excitement high and ensure everyone stays engaged throughout the game."
    },
    {
      icon: <Trophy className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Points System",
      description: "Earn points for accurate guesses and artistic skills. Climb the leaderboard and compete for the top spot."
    },
    {
      icon: <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Custom Rooms",
      description: "Create private rooms with custom settings. Choose round duration, word categories, and player limits."
    },
    {
      icon: <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Live Chat",
      description: "Chat with other players in real-time. Make friends, share strategies, and have fun conversations."
    },
    {
      icon: <Palette className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Drawing Tools",
      description: "Access a variety of brushes, colors, and tools. Express your creativity with our intuitive drawing interface."
    },
    {
      icon: <Share2 className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Share Results",
      description: "Share your game results and artwork on social media. Challenge friends and showcase your artistic skills."
    },
    {
      icon: <Lock className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Secure Gaming",
      description: "Play with peace of mind. Our platform ensures a safe and friendly environment for all players."
    },
    {
      icon: <Zap className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Instant Updates",
      description: "Experience real-time updates and smooth gameplay with our optimized WebSocket technology."
    }
  ];

  return (
    <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-white to-[#f3fae7]">
            {/* Hero Section */}
            <div className="pt-20 pb-16 md:pt-28 md:pb-24 px-4">
                <div className="max-w-6xl mx-auto text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-6">
                    Features that Make Drawing Fun
                </h1>
                <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                    Discover all the amazing features that make Sketch Slam the perfect platform for drawing and guessing games.
                </p>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-6xl mx-auto px-4 pb-20 md:pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {features.map((feature, index) => (
                    <div
                    key={index}
                    className="bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                    <div className="bg-[#f3fae7] w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6">
                        {feature.icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                        {feature.description}
                    </p>
                    </div>
                ))}
                </div>
            </div>
            </div>
        <Footer />
    </>
  );
}

export default Features;