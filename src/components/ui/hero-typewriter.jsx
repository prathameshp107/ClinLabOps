"use client";
import { motion } from "framer-motion";

export const HeroTypewriter = () => {
    const line1 = "Accelerate Your";
    const line2Part1 = "Research";
    const line2Part2 = " Workflow";

    const sentence = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.2,
                staggerChildren: 0.08,
            },
        },
    };

    const letter = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
        },
    };

    return (
        <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/50"
            variants={sentence}
            initial="hidden"
            animate="visible"
        >
            {line1.split("").map((char, index) => (
                <motion.span key={`l1-${index}`} variants={letter}>
                    {char}
                </motion.span>
            ))}
            <br />
            <span className="text-primary inline-block">
                {line2Part1.split("").map((char, index) => (
                    <motion.span key={`l2p1-${index}`} variants={letter} className="text-primary">
                        {char}
                    </motion.span>
                ))}
            </span>
            {line2Part2.split("").map((char, index) => (
                <motion.span key={`l2p2-${index}`} variants={letter}>
                    {char}
                </motion.span>
            ))}
        </motion.h1>
    );
};
