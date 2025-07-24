"use client";
import React from "react";
import SlideRevealText from "@/components/ui/slide-reveal";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <SlideRevealText
      text={"HORIZON"}
      delay={0}
      className={cn("font-orbitron font-semibold text-[1.5rem]", className)}
    />
  );
}


export function BrandWhite({ className }: LogoProps) {
  return (
    <div className=" flex gap-4">
        <Image src={"/logo/white.png"} alt="Logo" width={50} height={50} className={cn("w-10 h-10", className)} />
        <Logo className={cn("text-white",className)} />
    </div>
   
  );
}

export function BrandBlack({ className }: LogoProps) {
  return (
    <div className=" flex gap-4">
        <Image src={"/logo/black.png"} alt="Logo" width={50} height={50} className={cn("w-10 h-10", className)} />
        <Logo className={className} />
    </div>
   
  );
}