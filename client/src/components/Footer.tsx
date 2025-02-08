import { Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-[#f3fae7]">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-4">
                        <img src="./sketchslam-logo-black.png" alt="logo" className='w-36' />
                        <p className="text-gray-600">
                            Draw, guess, and have fun with friends in this multiplayer drawing
                            game.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                        <li>
                            <Link
                                to="/"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/create-room"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Create Room
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/join-room"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Join Room
                            </Link>
                        </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2">
                        <li>
                            <Link
                                to="/how-to-play"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                How to Play
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                About us
                            </Link>
                        </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <Link
                                to="https://github.com/swaparup36"
                                target="_blank"
                                className="bg-white p-2 rounded-xl hover:bg-[#e9f5d8] transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link
                                to="https://x.com/Swaparup36"
                                target="_blank"
                                className="bg-white p-2 rounded-xl hover:bg-[#e9f5d8] transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link
                                to="https://www.linkedin.com/in/swaparup-mukherjee-508001280/"
                                target="_blank"
                                className="bg-white p-2 rounded-xl hover:bg-[#e9f5d8] transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-[#d3e5b5]">
                <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} Swaparup Mukherjee. All rights reserved.
                    </p>
                </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
