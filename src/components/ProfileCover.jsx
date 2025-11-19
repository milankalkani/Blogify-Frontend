import React from "react";
import { motion } from "framer-motion";

const ProfileCover = ({ coverUrl, avatar, name, username }) => {
    return (
        <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-xl">
            {/* Cover Background */}
            <motion.img
                src={
                    coverUrl ||
                    "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80"
                }
                alt="cover"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            />

            {/* Glass Overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

            {/* Avatar + Name */}
            <div className="absolute -bottom-14 left-8 flex items-center gap-5">
                <motion.img
                    src={
                        avatar ||
                        `https://ui-avatars.com/api/?name=${name || "User"}&background=random`
                    }
                    alt="avatar"
                    className="w-28 h-28 rounded-full border-4 border-white shadow-2xl object-cover"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                >
                    <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
                        {name || "Your Name"}
                    </h1>
                    <p className="text-white/90">@{username || "username"}</p>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfileCover;
