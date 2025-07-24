'use client'
import React from 'react'
import { useEffect, useRef, useState } from 'react';
import createGlobe from "cobe";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const updateSize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  

  useEffect(() => {
    let phi = 0;
   
    if (!canvasRef.current) return;
   

    const gWidth = screenSize.width > 1000 ? 2400 :  screenSize.width > 800 ? 1700 : screenSize.width > 600 ? 1100 : 600;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: gWidth,
      height: gWidth,
      phi: 0,
      theta: 0,
      dark: 0.05,
      diffuse: 0.05,
      mapSamples: 30000,
      mapBrightness: 2,
      baseColor: [0.95, 0.95, 0.95],
      markerColor: [0.2, 0.6, 1],
      glowColor: [1, 1, 1],
      markers: [],
      onRender: (state: any) => {
      state.phi = phi;
      phi += 0.005;
      },
    });
   
    return () => {
      globe.destroy();
    };
  }, [screenSize]);
   
  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }} className=' flex justify-center'>
      <motion.div
        initial={{ x: 0, y: 100, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute w-full h-full"
      >
        <canvas
          ref={canvasRef}
          className={cn(
            "absolute bottom-0 sm:right-0  md:w-[1350px] md:h-[1350px] w-full max-w-full aspect-square origin-top-left  transform translate-y-[45%] sm:translate-x-[20%] sm:translate-y-[50%] md:translate-x-[30%] md:translate-y-[65%] lg:translate-y-[45%] lg:translate-x-[12%]  z-10",
            className
          )}
          
        

        />
      </motion.div>
    </div>
  );
};
