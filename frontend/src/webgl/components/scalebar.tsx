"use client";
import React, { useEffect, useState } from "react";
import { Map } from "maplibre-gl";

interface ScaleBarProps {
  map: Map;
  maxWidthPx?: number;
}

const niceScales = [
  1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 
  10000, 20000, 50000, 100000, 200000, 500000,
  1000000, 2000000, 5000000,
];

const ScaleBar: React.FC<ScaleBarProps> = ({ map, maxWidthPx = 100 }) => {
  const [scaleInfo, setScaleInfo] = useState({ meters: 0, pixelWidth: 0 });

  const updateScaleBar = () => {
    if (!map) return;
    const center = map.getCenter();
    // approximate meters per pixel at current center
    const metersPerPixel =
      (40075016.686 * Math.cos((center.lat * Math.PI) / 180)) /
      (Math.pow(2, map.getZoom()) * 256);
    const maximumMeters = metersPerPixel * maxWidthPx;

    let chosen = niceScales[0];
    for (const candidate of niceScales) {
      if (candidate <= maximumMeters) chosen = candidate;
      else break;
    }

    setScaleInfo({
      meters: chosen,
      pixelWidth: chosen / metersPerPixel,
    });
  };

  useEffect(() => {
    if (!map) return;
    updateScaleBar();
    map.on("move", updateScaleBar);
    map.on("zoom", updateScaleBar);
    return () => {
      map.off("move", updateScaleBar);
      map.off("zoom", updateScaleBar);
    };
  }, [map]);

  if (scaleInfo.meters === 0) return null;

  const label =
    scaleInfo.meters >= 1000
      ? `${scaleInfo.meters / 1000} km`
      : `${scaleInfo.meters} m`;

  return (
    <div className="fixed bottom-3 z-10">
      <div className="px-3 py-2 text-xs text-gray-800">
        <div className="text-center font-semibold">{label}</div>
        <div
          className="h-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-sm"
          style={{ width: scaleInfo.pixelWidth }}
        />
      </div>
    </div>
  );
};

export default ScaleBar;
