"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  textClassName,
}) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;
    
    let timeout;
    
    if (currentIndex < words.length) {
      timeout = setTimeout(() => {
        setCurrentText((prev) => prev + words[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30); // Adjust speed as needed
    } else {
      setIsComplete(true);
    }
    
    return () => clearTimeout(timeout);
  }, [currentIndex, words]);

  return (
    <div className={cn("font-bold", className)}>
      <motion.div
        className={cn("text-base sm:text-xl md:text-2xl", textClassName)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span>{currentText}</span>
        {!isComplete && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="ml-1 inline-block h-4 w-1 bg-primary"
          />
        )}
      </motion.div>
    </div>
  );
};

// Alternative version with word-by-word animation
export const TextGenerateEffectByWord = ({
  words,
  className,
  textClassName,
}) => {
  const [wordArray, setWordArray] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!words) return;
    
    // Split the text into words
    const wordsArray = words.split(" ");
    setWordArray(wordsArray);
    
    let timeout;
    
    if (currentIndex < wordsArray.length) {
      timeout = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 150); // Adjust speed as needed
    } else {
      setIsComplete(true);
    }
    
    return () => clearTimeout(timeout);
  }, [currentIndex, words]);

  return (
    <div className={cn("font-bold", className)}>
      <motion.div
        className={cn("text-base sm:text-xl md:text-2xl", textClassName)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {wordArray.map((word, index) => (
          <motion.span
            key={index}
            className="inline-block mr-1"
            initial={{ opacity: 0, y: 10 }}
            animate={index <= currentIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {word}
          </motion.span>
        ))}
        {!isComplete && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="ml-1 inline-block h-4 w-1 bg-primary"
          />
        )}
      </motion.div>
    </div>
  );
};