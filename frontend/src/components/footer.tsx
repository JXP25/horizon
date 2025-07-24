import React from "react";
import { BrandWhite } from "./logo";
import Image from "next/image";
import Link from "next/link";
import { hr } from "framer-motion/client";

export default function footer() {
  return (
    <div className="bg-[rgb(15,15,15)] text-white pt-[5rem] pb-[3rem] px-[5rem] flex flex-col gap-16 max-w-[100dvw] overflow-clip">
      <div className="  w-full flex gap-4 justify-between">
        <div className="flex flex-col gap-4">
          <BrandWhite />
          <span className="text-white/50 text-sm font-orbitron min-w-max">
            {"© copyright Horizon 2025, Developed by JXP"}
          </span>
        </div>

        <div className="flex gap-4 w-full justify-around text-white/90">
          <div className="flex flex-col gap-4">
            <span className="font-semibold text-sm ">Pages</span>
            <Link href={"/"} className=" text-sm">
              Home
            </Link>
            <Link href={"/Technology"} className=" text-sm">
              Technology
            </Link>
            <button
              onClick={() => {
                window.location.href = "/map";
              }}
              className=" text-sm text-left"
            >
              Map
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-semibold text-sm ">Legal</span>
            <Link href={"/"} className=" text-sm">
              Privacy Policy
            </Link>
            <Link href={"/"} className=" text-sm">
              Storage
            </Link>
            <Link href={"/"} className=" text-sm">
              Terms of Service
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-semibold text-sm ">Register</span>
            <Link href={"/"} className=" text-sm">
              Sign Up
            </Link>
            <Link href={"/"} className=" text-sm">
              Login
            </Link>
            <Link href={"/"} className=" text-sm">
              Forgot Password
            </Link>
          </div>
        </div>
      </div>

      <div className=" font-orbitron text-center leading-tight font-bold text-[15rem] bg-gradient-to-t from-[rgb(45,45,45)] to-[rgb(8,8,8)] bg-clip-text text-transparent">
        HORIZON
      </div>
    </div>
  );
}
