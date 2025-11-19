import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactTyped } from "react-typed";

const Hero = () => {
    const heroRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring motion
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), {
        stiffness: 120,
        damping: 15,
    });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), {
        stiffness: 120,
        damping: 15,
    });

    const handleMouseMove = (e) => {
        const rect = heroRef.current.getBoundingClientRect();
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
        <motion.section
            ref={heroRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="relative flex flex-col items-center justify-center h-[70vh] text-center overflow-hidden bg-gradient-to-br from-[#FFDDE1] via-[#FEEED9] to-[#D3F2FF] select-none"
        >
            {/* Floating Gradient Glow */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#FFB7C5]/40 via-[#D3F2FF]/40 to-[#C6E7FF]/40 blur-3xl opacity-60"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            />

            {/* Blogify Title */}
            <motion.h1
                className="text-6xl md:text-7xl font-extrabold text-gray-800 drop-shadow-lg z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                style={{ transform: "translateZ(50px)" }}
            >
                Blogify
                <motion.span
                    className="inline-block ml-2 text-transparent bg-clip-text bg-gradient-to-r from-[#5D866C] to-[#6BAA75]"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                >
                </motion.span>
            </motion.h1>

            {/* Typing tagline */}
            <motion.div
                className="mt-4 text-lg md:text-2xl text-gray-600 z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
                style={{ transform: "translateZ(40px)" }}
            >
                <ReactTyped
                    strings={[
                        "Share your thoughts 💡",
                        "Inspire the world 🌍",
                        "Write. Connect. Grow ✨",
                    ]}
                    typeSpeed={50}
                    backSpeed={25}
                    backDelay={1500}
                    loop
                />
            </motion.div>

            {/* Soft Glow Behind Text */}
            <motion.div
                className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-[#E0F7FA] to-[#FFEBEE] rounded-full blur-3xl opacity-50"
                style={{
                    top: "50%",
                    left: "50%",
                    translateX: "-50%",
                    translateY: "-50%",
                    transform: "translateZ(-50px)",
                }}
            />
        </motion.section>
    );
};

export default Hero;
