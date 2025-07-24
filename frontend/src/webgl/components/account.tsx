import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { clearCookies } from "@/lib/helpers";
export default function Account() {
  const [isExpanded, setIsExpanded] = useState(false);

  const user = {
    name: "Sample User",
    avatarUrl: "./logo/black.png",
  };

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      <div
        className="cursor-pointer bg-white flex justify-center items-center rounded-full shadow-sm  w-10 h-10"
        onClick={toggleMenu}
      >
        <PersonIcon />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white shadow-lg absolute right-3 top-14 rounded-lg p-2 w-40"
          >
            <ul className=" text-[1rem]">
              <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer rounded flex items-center">
                <span className="mr-3">
                  <SettingsIcon className="scale-90" />
                </span>
                Settings
              </li>
              <button
                onClick={clearCookies}
                className="py-2 px-4 w-full hover:bg-gray-100 cursor-pointer rounded text-red-500 flex items-center"
              >
                <span className="mr-3">
                  <LogoutIcon className="scale-90" />
                </span>
                Logout
              </button>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
