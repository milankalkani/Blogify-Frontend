// src/components/PostCard.jsx
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), {
        stiffness: 120,
        damping: 15,
    });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), {
        stiffness: 120,
        damping: 15,
    });

    const handleMouseMove = (e) => {
        const rect = cardRef.current.getBoundingClientRect();
        const offsetX = (e.clientX - rect.left) / rect.width - 0.5;
        const offsetY = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(offsetX);
        y.set(offsetY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 250, damping: 18 }}
            className="
        group relative
        bg-white/90 dark:bg-[#1c1c1c]/90
        backdrop-blur-xl
        rounded-2xl
        shadow-lg
        overflow-hidden
        cursor-pointer
        hover:shadow-2xl
        transition-all
        flex flex-col
        h-[380px] sm:h-[400px] md:h-[420px]
      "
        >
            <Link to={`/post/${post._id}`} className="flex flex-col h-full">
                {/* Image Section */}
                {post.image?.url && (
                    <div className="relative w-full h-[180px] sm:h-[200px] md:h-[220px] overflow-hidden">
                        <motion.img
                            src={post.image.url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            style={{ transformOrigin: "center" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}

                {/* Content Section */}
                <div className="flex flex-col justify-between flex-1 p-5">
                    <div>
                        <h3
                            className="
              text-lg md:text-xl font-semibold 
              text-[#4A7C59] dark:text-[#a5f3bc]
              group-hover:text-[#2e5237] dark:group-hover:text-[#7ee0a0]
              transition-colors
              line-clamp-2
            "
                        >
                            {post.title}
                        </h3>
                        <p
                            className="
              text-gray-600 dark:text-gray-300
              mt-2 text-sm md:text-base
              line-clamp-3
            "
                        >
                            {post.content}
                        </p>
                    </div>

                    <p
                        className="
            mt-4 text-xs md:text-sm
            text-[#4A7C59]/70 dark:text-gray-400 
            font-medium
          "
                    >
                        {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
};

export default PostCard;
