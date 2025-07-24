import React from "react";
import SliderevealText from "./ui/slide-reveal";

export default function headline() {
  return (
    <div className="  justify-center flex flex-col absolute bottom-0 opacity-20">
      <SliderevealText
        text="Stay"
        className="text-[8rem] font-orbitron uppercase text-white/20 translate-y-20"
        delay={0.3}
      />
      <SliderevealText
        text="disconnected"
        className="text-[11rem] font-orbitron uppercase text-white/20"
        delay={0.3}
      />
    </div>
  );
}
