/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import React from 'react';

export default function App() {
  const text = "Every project deserves its own fit. We tailor each one from scratch, carefully stitching every frame together with passion, purpose, and dedication. We believe great work comes from bringing together the right people, ideas, and perspectives that align with the vision. Every detail matters, every frame has a purpose, and every project deserves the care to make it feel truly its own.";
  
  const words = text.toUpperCase().split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.2 },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
      },
    },
    hidden: {
      opacity: 0,
      y: "100%",
    },
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#f2f2f2] font-sans selection:bg-neutral-800 selection:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-neutral-500 z-50 mix-blend-difference uppercase">
        <div>Art Of Cinema</div>
        <div>@KrnDsgn</div>
      </header>

      {/* Main Animation Section */}
      <main className="relative pt-[15vh] pb-[10vh] px-6 sm:px-12 md:px-16 lg:px-24">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-16 max-w-[1800px] mx-auto">
          
          {/* Animated Text Block */}
          <motion.div
            className="w-full lg:w-[75%]"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-[2.5rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] lg:leading-[0.95] font-black tracking-tighter">
              {words.map((word, index) => (
                <React.Fragment key={index}>
                  {/* Outer span hides the text before it slides up */}
                  <span className="inline-flex overflow-hidden pb-1 -mb-1 align-bottom">
                    <motion.span variants={child} className="inline-block">
                      {word}
                    </motion.span>
                  </span>
                  {/* Maintain natural word spacing for perfect wrapping */}
                  {index < words.length - 1 && " "}
                </React.Fragment>
              ))}
            </h1>
          </motion.div>

          {/* Right side portrait/element (Sticky) */}
          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            className="hidden lg:block w-full lg:w-[22%] aspect-[3/4] rounded-sm overflow-hidden bg-neutral-900 sticky bottom-16 border border-neutral-800"
          >
            <img
              src="https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=800&auto=format&fit=crop"
              alt="Creative Portrait"
              className="w-full h-full object-cover grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-700 ease-in-out hover:scale-105"
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
