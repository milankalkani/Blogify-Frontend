import React from "react";
import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="mt-20 w-full bg-gradient-to-br from-[#F7CED7]/40 via-[#F0E5EF]/40 to-[#CDE7FF]/50 backdrop-blur-xl border-t border-white/40">
            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between items-center gap-6">

                {/* Brand */}
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-gray-800">Blogify</h2>
                    <p className="text-gray-600 text-sm">Share your thoughts. Inspire the world.</p>
                </div>

                {/* Links */}
                <div className="flex gap-6 text-gray-700">
                    <a href="/" className="hover:text-black transition">Home</a>
                    <a href="/create" className="hover:text-black transition">Create</a>
                    <a href="/myposts" className="hover:text-black transition">My Posts</a>
                    <a href="/profile" className="hover:text-black transition">Profile</a>
                </div>

                {/* Social */}
                <div className="flex gap-5 text-gray-700 text-xl">
                    <a href="#" className="hover:text-black transition"><FaGithub /></a>
                    <a href="#" className="hover:text-black transition"><FaInstagram /></a>
                    <a href="#" className="hover:text-black transition"><FaTwitter /></a>
                </div>
            </div>

            <p className="text-center py-4 text-gray-500 text-sm">
                © {new Date().getFullYear()} Blogify. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;
