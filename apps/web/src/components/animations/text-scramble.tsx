"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextScrambleProps {
  children: string;
  className?: string;
  isDark?: boolean;
  duration?: number;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

export function TextScramble({
  children,
  className,
  isDark = true,
  duration = 1500,
  delay = 0,
  as: Component = "span",
}: TextScrambleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayText, setDisplayText] = useState(children);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isInView || hasAnimated) return;

    const targetText = children;
    const length = targetText.length;
      const frameRate = 30;
    const totalFrames = duration / frameRate;
    let frame = 0;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;

        const decodedLength = Math.floor(progress * length);

        let result = "";
        for (let i = 0; i < length; i++) {
          if (targetText[i] === " ") {
            result += " ";
          } else if (i < decodedLength) {
            result += targetText[i];
          } else {
            const randomness = 1 - (decodedLength / length);
            if (Math.random() < randomness) {
              result += CHARS[Math.floor(Math.random() * CHARS.length)];
            } else {
              result += targetText[i];
            }
          }
        }

        setDisplayText(result);

        if (frame >= totalFrames) {
          clearInterval(interval);
          setDisplayText(targetText);
          setHasAnimated(true);
        }
      }, frameRate);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, children, duration, delay, hasAnimated]);

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3, delay: delay / 1000 }}
    >
      <Component className={cn(isDark ? "text-white" : "text-zinc-900")}>
        {displayText}
      </Component>
    </motion.div>
  );
}

interface WordScrambleProps {
  text: string;
  className?: string;
  isDark?: boolean;
  wordDelay?: number;
}

export function WordScramble({
  text,
  className,
  isDark = true,
  wordDelay = 200,
}: WordScrambleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const words = text.split(" ");

  return (
    <motion.div
      ref={ref}
      className={cn("flex flex-wrap gap-x-[0.25em] gap-y-[0.1em]", className)}
    >
      {words.map((word, index) => (
        <ScrambleWord
          key={index}
          word={word}
          isDark={isDark}
          delay={index * wordDelay}
          isInView={isInView}
        />
      ))}
    </motion.div>
  );
}

function ScrambleWord({
  word,
  isDark,
  delay,
  isInView,
}: {
  word: string;
  isDark: boolean;
  delay: number;
  isInView: boolean;
}) {
  const [displayWord, setDisplayWord] = useState(word);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isInView || hasAnimated) return;

    const timeout = setTimeout(() => {
      const targetWord = word;
      const length = targetWord.length;
      const duration = 600;
      const frameRate = 40;
      const totalFrames = duration / frameRate;
      let frame = 0;

      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const decodedLength = Math.floor(progress * length);

        let result = "";
        for (let i = 0; i < length; i++) {
          if (i < decodedLength) {
            result += targetWord[i];
          } else {
            result += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }

        setDisplayWord(result);

        if (frame >= totalFrames) {
          clearInterval(interval);
          setDisplayWord(targetWord);
          setHasAnimated(true);
        }
      }, frameRate);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, word, delay, hasAnimated]);

  return (
    <motion.span
      className={cn(
        "inline-block",
        isDark ? "text-white" : "text-zinc-900"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
    >
      {displayWord}
    </motion.span>
  );
}

interface TypewriterProps {
  text: string;
  className?: string;
  isDark?: boolean;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
}

export function Typewriter({
  text,
  className,
  isDark = true,
  speed = 50,
  delay = 0,
  showCursor = true,
}: TypewriterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayText, setDisplayText] = useState("");
  const [showCursorState, setShowCursorState] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          const blinkInterval = setInterval(() => {
            setShowCursorState((prev) => !prev);
          }, 530);
          return () => clearInterval(blinkInterval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, text, speed, delay]);

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className={cn(isDark ? "text-white" : "text-zinc-900")}>
        {displayText}
      </span>
      {showCursor && (
        <motion.span
          className={cn(
            "inline-block w-[2px] h-[1em] ml-0.5 align-middle",
            isDark ? "bg-zinc-400" : "bg-zinc-600"
          )}
          animate={{ opacity: isComplete ? (showCursorState ? 1 : 0) : 1 }}
          transition={{ duration: 0.1 }}
        />
      )}
    </motion.div>
  );
}
