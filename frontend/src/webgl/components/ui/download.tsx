import React from "react";
import { Map } from "maplibre-gl";
import { motion } from "framer-motion";

import MapDownloader from "../mapDownloader";
import DownloadTable from "./downloadTable";

interface DownloadsOverlayProps {
  map: Map | null;
}

export default function DownloadsOverlay({ map }: DownloadsOverlayProps) {
  return (
    <motion.div
      className="absolute left-14 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        {map && <MapDownloader map={map} />}

        <DownloadTable map={map} />
      </div>
    </motion.div>
  );
}
