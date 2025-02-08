import Footer from "../components/Footer";
import Features from "../components/Landing/Features";
import Hero from "../components/Landing/Hero"
import Navbar from "../components/Landing/Navbar"

function Landing() {
  return (
    <div className="w-screen min-h-screen bg-[#f3fae7]">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  )
}

export default Landing;