"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/**
 * Premium overlay shown after the AI sends its final message.
 * Fades in over the chat, displays the EFSJ logo with a subtle
 * gold accent animation, and "Preparing your summary..." text.
 */
export default function CompletionTransition() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ivory"
    >
      {/* Soft radial glow behind logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1.2 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-64 h-64 rounded-full bg-gold blur-3xl"
        />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="relative z-10"
      >
        <Image
          src="/efsj-logo.png"
          alt="E.F. San Juan"
          width={80}
          height={80}
          className="rounded-full"
          priority
        />
      </motion.div>

      {/* Gold accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        className="relative z-10 mt-8 w-12 h-px bg-gold origin-center"
      />

      {/* Status text */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
        className="relative z-10 mt-6 font-playfair text-lg text-charcoal tracking-wide"
      >
        Preparing your summary&hellip;
      </motion.p>

      {/* Subtle pulsing dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.0 }}
        className="relative z-10 mt-4 flex gap-1.5"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block w-1.5 h-1.5 rounded-full bg-gold/60"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
