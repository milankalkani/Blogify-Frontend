import React from "react";
import Hero from "../components/HeroSection";
import PostList from "../components/PostList";
import { motion, useScroll, useTransform } from "framer-motion";

const Home = () => {
  const { scrollYProgress } = useScroll();

  // Soft parallax + fade on scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  return (
    <motion.div
      style={{ y, opacity }}
      className="min-h-screen bg-gradient-to-br from-[#fdfbfb] to-[#ebedee]"
    >
      {/* 🌟 HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Hero />
      </motion.div>

      {/* 📝 POST LIST SECTION */}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mt-10"
      >
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 leading-tight">
          Latest Posts
        </h1>

        <p className="text-gray-500 mt-3 text-lg max-w-2xl mx-auto">
          Discover fresh articles, ideas and stories from creators worldwide.
        </p>
      </motion.div>

      <motion.div
        className="max-w-7xl mx-auto px-6 py-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <PostList />
      </motion.div>
    </motion.div>
  );
};

export default Home;
