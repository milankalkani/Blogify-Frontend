import React, { useEffect } from "react";
import { usePosts } from "../context/PostContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MyPosts = () => {
    const { posts, fetchMyPosts, deletePost } = usePosts();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyPosts();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#F7CED7] via-[#F0E5EF] to-[#CDE7FF] py-28 px-6">

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-extrabold text-gray-900 text-center mb-12"
            >
                My Posts ✍️
            </motion.h1>

            {/* POSTS GRID */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {posts.length === 0 ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full text-center text-gray-600 text-xl"
                    >
                        You haven't created any posts yet.
                    </motion.p>
                ) : (
                    posts.map((post, i) => (
                        <motion.div
                            key={post._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.03 }}
                            className="relative group bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-lg overflow-hidden cursor-pointer"
                        >
                            {/* Clickable card */}
                            <div onClick={() => navigate(`/post/${post._id}`)}>
                                {post.image?.url && (
                                    <motion.img
                                        src={post.image.url}
                                        alt={post.title}
                                        className="w-full h-56 object-cover rounded-t-3xl"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.6 }}
                                    />
                                )}

                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                                        {post.title}
                                    </h2>

                                    <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                                        {post.content}
                                    </p>

                                    <p className="text-xs mt-3 text-gray-500">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* EDIT & DELETE on hover */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileHover={{ opacity: 1, y: 0 }}
                                className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Link
                                    to={`/edit/${post._id}`}
                                    className="bg-blue-600 text-white py-1 px-4 rounded-xl shadow hover:bg-blue-700 transition"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm("Delete this post?")) deletePost(post._id);
                                    }}
                                    className="bg-red-500 text-white py-1 px-4 rounded-xl shadow hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </motion.div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyPosts;
