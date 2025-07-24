"use client";

import { motion } from "framer-motion";

const ShootingStar = () => {
  return (
    <motion.div
      initial={{
        y: "-100vh",
        height: "0px",
        opacity: 0.5,
      }}
      animate={{
        y: "100vh",
        height: ["0px", "150px", "100px"],
        opacity: [0.5, 1, 0],
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
      }}
      className="absolute left-1/2  "
    >
      <div
        style={{
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
        className="absolute h-full -translate-x-1/2   w-[2px] bg-white "
      ></div>

      <div className="absolute h-[100%]   shadow-[0_0_4px_2px_rgba(255,255,255,0.6)]"></div>
      <div
        style={{
          backgroundColor: "rgba(255,255,255)",
        }}
        className=" blur-sm absolute bottom-0  translate-y-[100%] -translate-x-1/2 w-[10px] h-[5px] rounded-b-full"
      />

      <div className="absolute h-[55%]   shadow-[0_0_10px_3px_rgba(255,165,0,0.6)]"></div>
      <div className="absolute bottom-0 h-[40%]   shadow-[0_0_15px_5px_rgba(255,165,0,0.6)]"></div>
      <div
        style={{
          backgroundColor: "rgba(255,165,0,0.8)",
        }}
        className="  blur-md absolute bottom-0  translate-y-[100%] -translate-x-1/2 w-[20px] h-[10px] rounded-b-full"
      />
    </motion.div>
  );
};

export default ShootingStar;
