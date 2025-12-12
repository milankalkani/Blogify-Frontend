// src/components/PostList.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { usePosts } from "../context/PostContext";
import PostCard from "./PostCard";

const PostList = () => {
  const { posts, fetchPosts, loading } = usePosts();

  useEffect(() => {
    fetchPosts();
  }, []); // fetch posts on load

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <motion.div
          className="w-10 h-10 border-4 border-[#5D866C] border-t-transparent rounded-full animate-spin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        No posts yet. Start by creating your first one!
      </div>
    );
  }

  return (
    <motion.div
      className="
    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
    gap-6 sm:gap-8 md:gap-10 
    place-items-center
  "
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {posts.map((post, i) => (
        <motion.div
          key={post._id || i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <PostCard post={post} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PostList;
