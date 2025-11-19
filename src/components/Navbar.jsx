// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <>
      {/* Floating Avatar Button */}
      <motion.div
        className="fixed top-6 left-6 z-50 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMenu}
      >
        <img
          src={user?.avatar || "https://i.pravatar.cc/80"}
          alt="User Avatar"
          className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
        />
      </motion.div>

      {/* Expanding Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -40, y: -40 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -40, y: -40 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="fixed top-20 left-6 w-56 bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-5 z-40"
          >
            <div className="flex flex-col gap-3">
              <Link to="/" className="hover:text-[#5D866C]" onClick={() => setOpen(false)}>
                🏠 Home
              </Link>
              {user && (
                <>
                  <Link to="/create" className="hover:text-[#5D866C]" onClick={() => setOpen(false)}>
                    ✍️ Create Post
                  </Link>
                  <Link to="/myposts" className="hover:text-[#5D866C]" onClick={() => setOpen(false)}>
                    📜 My Posts
                  </Link>
                  <Link to="/profile" className="hover:text-[#5D866C]" onClick={() => setOpen(false)}>
                    👤 Profile
                  </Link>
                </>
              )}
              <hr className="border-white/40 my-2" />
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                    navigate("/");
                  }}
                  className="text-left text-red-500 hover:text-red-700"
                >
                  🚪 Logout
                </button>
              ) : (
                <Link to="/login" className="hover:text-[#5D866C]" onClick={() => setOpen(false)}>
                  🔑 Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
