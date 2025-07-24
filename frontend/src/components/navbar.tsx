import React from "react";
import Logo, { BrandBlack } from "@/components/logo";
import Image from "next/image";

export default function navbar() {
  return (
    <div
      className={`fixed z-50 px-4 py-3 flex h-[5rem] justify-between top-0 items-center w-full  transition-colors duration-300`}
    >
      <BrandBlack />

      
    </div>
  );
}
