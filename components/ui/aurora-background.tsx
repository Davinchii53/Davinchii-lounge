"use client";

import React from 'react';
import { motion } from 'framer-motion';

const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2)_0%,#000_100%)] z-10" />
      
      {/* Aurora 1 - Cyan/Blue */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] rounded-[100%] bg-cyan-500/20 blur-[120px] mix-blend-screen"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      {/* Aurora 2 - Purple */}
      <motion.div
        className="absolute top-[20%] right-[-10%] w-[60vw] h-[80vh] rounded-[100%] bg-purple-600/20 blur-[130px] mix-blend-screen"
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 100, -50, 0],
          scale: [1, 1.1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      {/* Aurora 3 - Deep Blue */}
      <motion.div
        className="absolute bottom-[-20%] left-[20%] w-[80vw] h-[60vh] rounded-[100%] bg-blue-600/20 blur-[140px] mix-blend-screen"
        animate={{
          x: [0, 50, -100, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.3, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      {/* Cyberpunk Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] z-20 opacity-30 mask-image:linear-gradient(to_bottom,black,transparent)]" />
    </div>
  );
};

export default AuroraBackground;
