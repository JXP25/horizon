import React, { useEffect, useState } from "react";
import { Map } from "maplibre-gl";
import { useLazyQuery } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  GET_POINTS_AMENITY_IN_BBOX,
  GET_AMENITY_IN_BBOX,
} from "@/graphql/query/point";

interface AmenityProps {
  map: Map;
}

interface Amenity {
  name: string;
  count: number;
}

const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.7,
    },
  },
};

export default function Amenity({ map }: AmenityProps) {
  const [activeAmenity, setActiveAmenity] = useState<string | null>(null);

  const [fetchAmenity] = useLazyQuery(GET_POINTS_AMENITY_IN_BBOX);
  const [fetchAmenities] = useLazyQuery(GET_AMENITY_IN_BBOX);
  const [amenities, setAmenities] = useState<Amenity[]>([]);

  const addAmenityLayer = (amenity: string, geojsonData: any) => {
    const sourceId = `amenity-source-${amenity}`;
    const layerId = `amenity-layer-${amenity}`;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: geojsonData,
      });
    }

    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: "circle",
        source: sourceId,
        paint: {
          "circle-radius": 5,
          "circle-color": "#FF5722",
        },
      });
    }
  };

  const removeAmenityLayer = (amenity: string) => {
    const sourceId = `amenity-source-${amenity}`;
    const layerId = `amenity-layer-${amenity}`;

    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  };

  const handleAmenityClick = async (amenity: Amenity) => {
    const amenityKey = amenity.name.toLowerCase();

    if (activeAmenity === amenityKey) {
      removeAmenityLayer(amenityKey);
      setActiveAmenity(null);
      return;
    }

    if (activeAmenity) {
      removeAmenityLayer(activeAmenity);
    }

    const bounds = map.getBounds();
    const minLon = bounds.getWest();
    const minLat = bounds.getSouth();
    const maxLon = bounds.getEast();
    const maxLat = bounds.getNorth();

    try {
      const results = await fetchAmenity({
        variables: {
          minLon,
          minLat,
          maxLon,
          maxLat,
          amenity: amenityKey,
        },
      });

      if (results?.data?.pointsByAmenity) {
        addAmenityLayer(amenityKey, results.data.pointsByAmenity);
        setActiveAmenity(amenityKey);
      }
    } catch (err) {
      console.error("Error loading amenity data:", err);
    }
  };

  useEffect(() => {
    if (!map) return;

    const handleMoveEnd = () => {
      const bounds = map.getBounds();
      const minLon = bounds.getWest();
      const minLat = bounds.getSouth();
      const maxLon = bounds.getEast();
      const maxLat = bounds.getNorth();

      fetchAmenities({
        variables: { minLon, minLat, maxLon, maxLat },
      })
        .then((response) => {
          const fetchedAmenities = response?.data?.amenitiesInBbox || [];

          const sortedAmenities = [...fetchedAmenities].sort(
            (a: Amenity, b: Amenity) => b.count - a.count
          );

          setAmenities(sortedAmenities.slice(0, 10));
        })
        .catch((error) => {
          console.error("Error fetching amenities:", error);
        });
    };

    handleMoveEnd();
    map.on("moveend", handleMoveEnd);

    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map, fetchAmenities]);

  return (
    <motion.div
      className="flex flex-row gap-2 w-full -translate-y-2 overflow-x-auto p-2"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence>
        {amenities.map((amenity, index) => {
          if (!amenity || !amenity.name) return null;
          const amenityKey = amenity.name.toLowerCase();
          const isActive = activeAmenity === amenityKey;

          return (
            <motion.div
              key={amenityKey}
              custom={index}
              variants={{
                hidden: { opacity: 0, x: 15 },
                show: (idx) => ({
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: idx * 0.15,
                    duration: 0.6,
                    ease: "easeOut",
                  },
                }),
                exit: { opacity: 0, x: 15, transition: { duration: 0.4 } },
              }}
              initial="hidden"
              animate="show"
              exit="exit"
              layout
              className={`flex flex-row gap-2 min-w-max items-center text-[1rem] justify-center px-3 py-2 rounded-full shadow-md transition-all duration-100 cursor-pointer ${
                isActive ? "bg-gray-700 text-white" : "bg-white hover:scale-105"
              }`}
              onClick={() => handleAmenityClick(amenity)}
            >
              <span className="capitalize">
                {amenity.name.replace(/_/g, " ")}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
