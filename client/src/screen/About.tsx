import { Heart, Target, Users, Brush } from 'lucide-react';
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Footer';

function About() {
  const values = [
    {
      icon: <Heart className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Passion",
      description: "We're passionate about creating fun and engaging experiences that bring people together."
    },
    {
      icon: <Target className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Innovation",
      description: "We constantly push boundaries to deliver cutting-edge gaming experiences."
    },
    {
      icon: <Users className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Community",
      description: "We believe in fostering a welcoming and inclusive gaming community."
    },
    {
      icon: <Brush className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />,
      title: "Creativity",
      description: "We encourage creative expression and artistic development in all our users."
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
                    About Sketch Slam
                </h1>
                <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                    I'm a passionate developer creating the ultimate drawing and guessing game experience.
                </p>
                </div>
            </div>

            {/* Our Values */}
            <div className="max-w-6xl mx-auto px-4 pb-20">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {values.map((value, index) => (
                    <div
                    key={index}
                    className="bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                    <div className="bg-[#f3fae7] w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6">
                        {value.icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                        {value.description}
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

export default About;