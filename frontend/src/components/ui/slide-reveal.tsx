'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Global Import -> import SlideRevealText from "@/components/customText/slide-reveal";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const AnimatedText = ({ text, className, delay = 0 }: AnimatedTextProps) => {
  const letters = text.split('');

  return (
    <motion.div
      className={cn('flex gap-[2px] flex-wrap', className)}
      initial="hidden"
      animate="visible"
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, x: 20 },
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                duration: 0.7,
                delay: delay + index * 0.05, 
              },
            },
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedText;
