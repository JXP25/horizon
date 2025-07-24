"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "locomotive-scroll/dist/locomotive-scroll.css";
import Image from "next/image";
import Road from "@/components/road";
import { Globe } from "@/components/ui/globe";
import { AuroraText } from "@/components/ui/aurora";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";
import PullUpText from "@/components/ui/pullUp";
import { motion } from "framer-motion";

export default function Page() {
  const [isWhiteSectionVisible, setIsWhiteSectionVisible] = useState(false);
  const whiteSectionRef = useRef(null);
  const scrollRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (scrollRef.current) {
      const LocomotiveScroll = require("locomotive-scroll").default;
      const locomotive = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
      });

      locomotive.on("scroll", (args: any) => {
        setScrollY(args.scroll.y);
      });

      return () => {
        locomotive.destroy();
      };
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      // Dynamically require LocomotiveScroll to avoid SSR errors
      const LocomotiveScroll = require("locomotive-scroll").default;
      const locomotive = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
      });

      return () => {
        locomotive.destroy();
      };
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsWhiteSectionVisible(entry.isIntersecting);
      },
      {
        threshold: 0.98,
      }
    );

    if (whiteSectionRef.current) {
      observer.observe(whiteSectionRef.current);
    }

    return () => {
      if (whiteSectionRef.current) {
        observer.unobserve(whiteSectionRef.current);
      }
    };
  }, []);

  const sectionClass = `relative 2xl:px-[4rem] 2xl:pb-[5rem]  xl:px-[3.5rem] xl:pb-[5rem]  md:px-[2.5rem] md:pb-[4rem] sm:pb-[3rem] sm:px-[2rem] pb-[2rem] px-[1rem] pt-[5rem] w-full min-h-[100dvh] flex justify-center items-center`;

  return (
    <div className="flex flex-col w-full justify-center items-center overflow-y-clip ">
      <Toaster position="top-center" />
      <Navbar />

      <div
        id="main-container"
        data-scroll-container
        ref={scrollRef}
        className="overflow-y-auto w-full"
      >


        <section className={`${sectionClass}`}>
          <div className="relative w-full h-full flex flex-col sm:justify-center py-5  2xl:px-[5rem]   xl:px-[4rem]   md:px-[3rem]   sm:px-[2rem]  px-[1rem] rounded-2xl bg-gray-200 overflow-clip">
            <span className="2xl:text-[8.5rem] xl:text-[7rem]  lg:text-[5.5rem] md:text-[4rem] sm:text-[3.5rem] text-[2rem] font-aeonik  md:leading-tight leading-normal relative">
              <motion.span
                initial={{ x: 0 }}
                animate={{ x: 20 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="inline-block sm:mr-8 mr-2"
              >
                <AuroraText>
               {"Innovative"}
                </AuroraText>
              </motion.span>
              <motion.span
                initial={{ x: 0 }}
                animate={{ x: 20 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="inline-block"
              >
                <PullUpText text="Mapping" />
              </motion.span>
            </span>

            <span className=" 2xl:text-[8.5rem] xl:text-[7rem] lg:text-[5.5rem] md:text-[4rem] sm:text-[3.5rem] text-[2rem]  font-aeonik md:leading-tight leading-normal relative  sm:-translate-y-4  mb-6">
              <PullUpText text="Unmatched Detail" />
            </span>


            <div className="  flex px-5 w-full justify-start  text-sm sm:text-lg  ">
              <div className="  sm:max-w-md w-full text-justify sm:text-left">
                <motion.span
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-left"
                >
                  {`Our platform brings the world to your fingertips, even without an internet connection. Explore rich, high-detail maps powered by OpenStreetMap data, all available offline whenever you need them. With cutting-edge 3D visuals rendered through WebGL, it’s not just a map, it’s an experience. Whether you're navigating a new place or just curious, relive the real world in a whole new way.`}
                </motion.span>

                <motion.button
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0 }}
                  onClick={() => {
                    window.location.href = "/map";
                  }}
                  className="px-4 py-3 w-full sm:w-auto  relative z-40 cursor-po font-aeonik uppercase tracking-widest sm:mt-16 mt-6 rounded-full bg-[rgb(15,15,15)] flex justify-center items-center text-center text-white/90"
                >
                  Try Horizon <KeyboardArrowRightIcon />
                </motion.button>

                <div className="lg:h-[3rem]">

                </div>
              </div>
            </div>

            <Globe />
          </div>
        </section>


        {/* <section className={`${sectionClass}`}>
          <div className="absolute flex flex-row w-full  justify-around top-0 translate-y-[-50%] ">
            {Array(5)
              .fill("")
              .map((plus, index) => (
                <span
                  key={index}
                  className="transition-transform flex items-center justify-center duration-500"
                  style={{
                    transform: `rotate(${scrollY}deg)`,
                  }}
                >
                  <AddIcon fontSize="large" />
                </span>
              ))}
          </div>
          <div className=" w-full h-full flex flex-col justify-center items-center ">
            features
          </div>
        </section>
        <section className={`${sectionClass}`}>
          <div className="absolute flex flex-row w-full  justify-around top-0 translate-y-[-50%] ">
            {Array(5)
              .fill("")
              .map((plus, index) => (
                <span
                  key={index}
                  className="transition-transform flex items-center justify-center duration-500"
                  style={{
                    transform: `rotate(${scrollY}deg)`,
                  }}
                >
                  <AddIcon fontSize="large" />
                </span>
              ))}
          </div>
          <div className=" w-full h-full flex flex-col justify-center items-center bg-gray-200">
            Extras
          </div>
        </section> */}

        <Footer />
      </div>
    </div>
  );
}
