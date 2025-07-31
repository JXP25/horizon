"use client";

import React, { useEffect } from "react";
import Logo from "@/components/logo";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

const MapCanvas = dynamic(() => import("@/webgl"), {
  ssr: false,
});

export default function Map() {
  useEffect(() => {
    toast.success("Hong Kong region is available");
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Toaster position="bottom-center" />
      <div className=" fixed left-6 bottom-6 opacity-20 ">
        <Logo />
      </div>

      <MapCanvas />
    </div>
  );
}
