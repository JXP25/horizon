import React, { useState } from "react";
import GradeIcon from "@mui/icons-material/Grade";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Cookies from "js-cookie";
import SignInForm from "../../components/forms/signin";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import { AnimatePresence, motion } from "framer-motion";
import ControlsOverlay from "./ui/shortcuts";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { Map } from "maplibre-gl";
import Image from "next/image";
import DownloadsOverlay from "./ui/download";

interface MenuProps {
  map: Map;
}

export default function Menu({ map }: MenuProps) {
  const [activeOption, setActiveOption] = useState<string | null>(null);

  const token = Cookies.get("token");
  const buttonsDisabled = !token;

  const handleButtonClick = () => {
    if (buttonsDisabled) {
      setActiveOption((prev) => (prev === "signUp" ? null : "signUp"));
    }
  };

  const handleControlClick = () => {
    setActiveOption((prev) => (prev === "controls" ? null : "controls"));
  };

  const handleDownloadClick = () => {
    setActiveOption((prev) => (prev === "download" ? null : "download"));
  };

  const showSignUp = activeOption === "signUp";
  const showControls = activeOption === "controls";
  const showDownload = activeOption === "download";



  return (
    <>
      <div>
        <div className="flex z-10 flex-col items-start justify-center gap-3 absolute top-20 left-6">
         
          <button
            className="bg-white shadow-md flex items-center justify-center rounded-full w-10 h-10 transition-all hover:scale-110 duration-100"
            onClick={handleButtonClick}
          >
            <StarBorderIcon />
          </button>
          <button
            className="bg-white shadow-md flex items-center justify-center rounded-full w-10 h-10 transition-all hover:scale-110 duration-100"
            onClick={handleButtonClick}
          >
            <ScheduleIcon />
          </button>
          <div className=" flex gap-4">
            <button
              className="bg-white shadow-md flex items-center justify-center rounded-full w-10 h-10 transition-all hover:scale-110 duration-100"
              onClick={handleDownloadClick}
            >
              <SaveAltIcon />
            </button>
            <AnimatePresence>
              {showDownload && (
                <DownloadsOverlay map={map} />
              )}
            </AnimatePresence>
          </div>

          <div className=" flex gap-4">
            <button
              onClick={handleControlClick}
              className="bg-white shadow-md flex items-center justify-center rounded-full w-10 h-10 transition-all hover:scale-110 duration-100"
            >
              <KeyboardIcon />
            </button>
            <AnimatePresence>
              {showControls && (
                <ControlsOverlay />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {showSignUp && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveOption((prev) => (prev === "signUp" ? null : "signUp"));
            }
          }}
        >
          <SignInForm
            onSubmit={() => {
              setActiveOption((prev) => (prev === "signUp" ? null : "signUp"));
            }}
          />
        </div>
      )}
    </>
  );
}
