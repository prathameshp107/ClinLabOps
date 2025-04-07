"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const TextGenerateEffect = ({ words, className }) => {
  const [renderedText, setRenderedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < words.length) {
      const timeout = setTimeout(() => {
        setRenderedText((prev) => prev + words[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 40);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, words]);

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-base sm:text-lg md:text-xl">
          {renderedText}
          {!isComplete && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block ml-1 h-4 w-2 bg-primary"
            />
          )}
        </p>
      </motion.div>
    </div>
  );
};