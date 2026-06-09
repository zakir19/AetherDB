"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealType = "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale" | "blur" | "flip";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  type?: RevealType;
  delay?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
  distance?: number;
}

const getVariants = (type: RevealType, distance: number): Variants => {
  const variants: Record<RevealType, Variants> = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    "slide-up": {
      hidden: { opacity: 0, y: distance },
      visible: { opacity: 1, y: 0 },
    },
    "slide-down": {
      hidden: { opacity: 0, y: -distance },
      visible: { opacity: 1, y: 0 },
    },
    "slide-left": {
      hidden: { opacity: 0, x: distance },
      visible: { opacity: 1, x: 0 },
    },
    "slide-right": {
      hidden: { opacity: 0, x: -distance },
      visible: { opacity: 1, x: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    blur: {
      hidden: { opacity: 0, filter: "blur(10px)" },
      visible: { opacity: 1, filter: "blur(0px)" },
    },
    flip: {
      hidden: { opacity: 0, rotateX: -15, y: distance },
      visible: { opacity: 1, rotateX: 0, y: 0 },
    },
  };

  return variants[type];
};

export function SectionReveal({
  children,
  className,
  type = "slide-up",
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.2,
  distance = 40,
}: SectionRevealProps) {
  const variants = getVariants(type, distance);

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  delayChildren = 0,
  once = true,
  amount = 0.2,
}: StaggerContainerProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  type?: RevealType;
  distance?: number;
}

export function StaggerItem({
  children,
  className,
  type = "slide-up",
  distance = 30,
}: StaggerItemProps) {
  const variants = getVariants(type, distance);

  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  offset?: number;
  speed?: number;
}

export function Parallax({
  children,
  className,
  offset = 50,
  speed = 0.5,
}: ParallaxProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ y: offset }}
      whileInView={{ y: -offset }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{
        duration: 0.8,
        ease: "linear",
      }}
      style={{
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}

interface MarqueeRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function MarqueeReveal({
  children,
  className,
  delay = 0,
}: MarqueeRevealProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        duration: 1,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ transformOrigin: "center" }}
    >
      {children}
    </motion.div>
  );
}

interface CardDealProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
  baseDelay?: number;
}

export function CardDeal({
  children,
  className,
  index = 0,
  baseDelay = 0,
}: CardDealProps) {
  const row = Math.floor(index / 3);
  const col = index % 3;
  const delay = baseDelay + row * 0.1 + col * 0.05;

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 60, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: "1000px" }}
    >
      {children}
    </motion.div>
  );
}

interface TimelineRevealProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

export function TimelineReveal({
  children,
  className,
  index = 0,
}: TimelineRevealProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        duration: 0.6,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        className="absolute left-[23px] top-8 w-px bg-gradient-to-b from-zinc-500 to-zinc-700"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.4,
          delay: index * 0.2 + 0.3,
          ease: "easeOut",
        }}
        style={{ transformOrigin: "top", height: "calc(100% + 2rem)" }}
      />
      {children}
    </motion.div>
  );
}

interface CounterRevealProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

export function CounterReveal({
  children,
  className,
  index = 0,
}: CounterRevealProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

interface CTArevealProps {
  children: React.ReactNode;
  className?: string;
}

export function CTAreveal({ children, className }: CTArevealProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
