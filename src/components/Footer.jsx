import React from "react";
import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-br from-[#F7CED7]/40 via-[#F0E5EF]/40 to-[#CDE7FF]/50 backdrop-blur-xl border-t border-white/40">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center gap-8">

        {/* Brand */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Blogify</h2>
          <p className="text-gray-600 mt-1 text-sm">Share your thoughts. Inspire the world.</p>
        </div>

        {/* Links */}
        <div className="flex gap-8 text-gray-700 text-sm font-medium">
          <a href="/" className="hover:text-black transition">Home</a>
          <a href="/create" className="hover:text-black transition">Create</a>
          <a href="/myposts" className="hover:text-black transition">My Posts</a>
          <a href="/profile" className="hover:text-black transition">Profile</a>
        </div>

        {/* Social */}
        <div className="flex gap-6 text-gray-700 text-2xl">
          <a href="#" className="hover:text-black transition"><FaGithub /></a>
          <a href="#" className="hover:text-black transition"><FaInstagram /></a>
          <a href="#" className="hover:text-black transition"><FaTwitter /></a>
        </div>

        {/* Copyright */}
        <p className="text-gray-500 text-xs mt-4">
          © {new Date().getFullYear()} Blogify. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
