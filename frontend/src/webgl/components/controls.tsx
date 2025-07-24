"use client";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { Map } from "maplibre-gl";
import MapIcon from "@mui/icons-material/Map";
import WebStoriesIcon from "@mui/icons-material/WebStories";
import toast from "react-hot-toast";
import { extrudedBuildingsLayer } from "../layers/polygon";
interface ZoomControlsProps {
  map: Map;
  userLocation: maplibregl.LngLat | null;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ map, userLocation }) => {
  const handleZoomIn = () => {
    map.easeTo({ zoom: map.getZoom() + 1, duration: 1000 });
  };

  const handleZoomOut = () => {
    map.easeTo({ zoom: map.getZoom() - 1, duration: 1000 });
  };

  const handleMyLocationClick = () => {
    if (map && userLocation) {
      map.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 14,
        duration: 4000,
      });
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    const askPosition = () =>
      navigator.geolocation.getCurrentPosition(
        () => {},
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            toast.error("Please allow location access.");
          } else {
            toast.error("Unable to retrieve your location.");
          }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );

    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((res) => {
          if (res.state === "denied") {
            toast.error(
              "Location permission is blocked. Enable it in browser settings."
            );
          } else {
            askPosition();
          }
        })
        .catch(() => askPosition());
    } else {
      askPosition();
    }
  };

  const [isTilted, setIsTilted] = useState(false);

  const toggleTilt = () => {
    if (!map) return;

    

    if (isTilted) {
      map.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 2000,
        easing: (t) => t,
      });
      setIsTilted(false);
    } else {
      toast("Pro tip: 'shift + ↑ or ↓' to pitch");
      map.easeTo({
        pitch: 35,
        bearing: 0,
        duration: 2000,
        easing: (t) => t,
      });
      setIsTilted(true);
    }
  };

  const toggleGL = () => {
    if (!map) return;

    if (map.getLayer(extrudedBuildingsLayer.layer.id)) {
      map.removeLayer(extrudedBuildingsLayer.layer.id);
    } else {
      map.addLayer(extrudedBuildingsLayer.layer);
    }
  };
  const [zoom, setZoom] = useState(map.getZoom().toFixed(1));

  React.useEffect(() => {
    const updateValues = () => {
      setZoom(map.getZoom().toFixed(1));
    };

    map.on("move", updateValues);
    map.on("zoom", updateValues);

    return () => {
      map.off("move", updateValues);
      map.off("zoom", updateValues);
    };
  }, [map]);

  return (
    <div className="flex z-10 flex-col items-end justify-center gap-3 absolute right-6 bottom-6">
      <button
        onClick={toggleGL}
        className="bg-white shadow-md flex items-center justify-center rounded-full w-10 h-10 transition-all hover:scale-110 duration-100"
      >
        <WebStoriesIcon />
      </button>
      <button
        onClick={toggleTilt}
        className="bg-white shadow-md flex items-center justify-center rounded-full w-10 h-10 transition-all hover:scale-110 duration-100"
      >
        <MapIcon />
      </button>

      <button
        onClick={handleZoomIn}
        className="bg-white shadow-md flex items-center justify-center rounded-full w-10 h-10 transition-all hover:scale-110 duration-100"
      >
        <AddIcon />
      </button>

      <div className="bg-white flex gap-3 shadow-md rounded-lg p-2 min-w-[2.6rem] justify-center text-[0.8rem] text-gray-800">
        <div>{zoom}</div>
      </div>

      <div className="flex flex-row items-center justify-end gap-3">
        <button
          onClick={handleMyLocationClick}
          className="bg-white shadow-md flex items-center justify-center rounded-full w-10 h-10 transition-all hover:scale-110 duration-100"
        >
          <MyLocationIcon className=" scale-90" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white shadow-md flex items-center justify-center rounded-full w-10 h-10 transition-all hover:scale-110 duration-100"
        >
          <RemoveIcon />
        </button>
      </div>
    </div>
  );
};

export default ZoomControls;
