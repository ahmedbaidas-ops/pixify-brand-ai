import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedLetterProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const AnimatedLetter = ({ children, delay = 0, className = "" }: AnimatedLetterProps) => {
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0, y: 50, rotateX: -90 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.span>
  );
};

interface AnimatedTextProps {
  text: string;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
}

export const AnimatedText = ({ 
  text, 
  className = "", 
  staggerDelay = 0.05,
  initialDelay = 0 
}: AnimatedTextProps) => {
  return (
    <span className={className} style={{ perspective: "1000px" }}>
      {text.split("").map((char, idx) => (
        <AnimatedLetter key={idx} delay={initialDelay + idx * staggerDelay}>
          {char === " " ? "\u00A0" : char}
        </AnimatedLetter>
      ))}
    </span>
  );
};
