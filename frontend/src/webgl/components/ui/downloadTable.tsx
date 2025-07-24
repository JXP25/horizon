import React, { useEffect, useState } from "react";
import { Map } from "maplibre-gl";
import {
  getAllOfflineAreas,
  deleteOfflineArea,
  getOfflineArea,
} from "../../utils/idbOfflineStorage";
import type {
  FeatureCollection,
  Polygon,
  GeoJsonProperties,
  Feature,
} from "geojson";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteRowsByIds } from "@/webgl/utils/idb";

interface DownloadTableProps {
  map: Map | null;
}

export default function DownloadTable({ map }: DownloadTableProps) {
  const [areas, setAreas] = useState<Array<{ bboxKey: string; data: any }>>([]);
  const [currentlyPreviewed, setCurrentlyPreviewed] = useState<string | null>(
    null
  );

  useEffect(() => {
    loadAreas();

    return () => {
      removePreviewOverlay();
    };
  }, []);

  async function loadAreas() {
    try {
      const offlineAreas = await getAllOfflineAreas();
      setAreas(offlineAreas);
    } catch (error) {
      console.error("Error loading offline areas:", error);
    }
  }

  function handlePreview(bboxKey: string) {
    if (!map) return;

    if (currentlyPreviewed) {
      removePreviewOverlay();
    }

    const [minLon, minLat, maxLon, maxLat] = bboxKey.split(",").map(Number);
    const centerLon = (minLon + maxLon) / 2;
    const centerLat = (minLat + maxLat) / 2;

    map.flyTo({ center: [centerLon, centerLat], zoom: 16 });

    drawPreviewOverlay(minLon, minLat, maxLon, maxLat);
    setCurrentlyPreviewed(bboxKey);
  }

  function drawPreviewOverlay(
    minLon: number,
    minLat: number,
    maxLon: number,
    maxLat: number
  ) {
    if (!map) return;

    const coords: [number, number][] = [
      [minLon, minLat],
      [minLon, maxLat],
      [maxLon, maxLat],
      [maxLon, minLat],
      [minLon, minLat],
    ];

    const feature: Feature<Polygon, GeoJsonProperties> = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [coords],
      },
      properties: {
        color: "#808080",
      },
    };

    const geojson: FeatureCollection<Polygon, GeoJsonProperties> = {
      type: "FeatureCollection",
      features: [feature],
    };

    const srcId = "previewBboxSource";
    const fillLayerId = "previewBboxFill";
    const outlineLayerId = "previewBboxOutline";

    if (!map.getSource(srcId)) {
      map.addSource(srcId, {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: outlineLayerId,
        type: "line",
        source: srcId,
        paint: {
          "line-color": ["coalesce", ["get", "color"], "#808080"],
          "line-width": 2,
        },
      });

      map.addLayer({
        id: fillLayerId,
        type: "fill",
        source: srcId,
        paint: {
          "fill-color": ["coalesce", ["get", "color"], "#808080"],
          "fill-opacity": 0.2,
        },
      });
    } else {
      const src = map.getSource(srcId) as maplibregl.GeoJSONSource;
      src.setData(geojson);
    }
  }

  function removePreviewOverlay() {
    if (!map) return;
    const srcId = "previewBboxSource";
    const fillLayerId = "previewBboxFill";
    const outlineLayerId = "previewBboxOutline";

    if (map.getLayer(fillLayerId)) {
      map.removeLayer(fillLayerId);
    }
    if (map.getLayer(outlineLayerId)) {
      map.removeLayer(outlineLayerId);
    }
    if (map.getSource(srcId)) {
      map.removeSource(srcId);
    }
    setCurrentlyPreviewed(null);
  }

  async function handleDelete(bboxKey: string) {
    try {
      if (currentlyPreviewed === bboxKey) {
        removePreviewOverlay();
      }
      const idObj = await getOfflineArea(bboxKey);

      if (!idObj) {
        console.error("No data found for the given bboxKey:", bboxKey);
        return;
      }
    
      await deleteRowsByIds(idObj);
      await deleteOfflineArea(bboxKey);
      await loadAreas();
    } catch (error) {
      console.error("Error deleting offline area:", error);
    }
  }

  return (
    <div style={{ marginTop: 20 }}>
      <span className="text-sm text-gray-500 inline-block min-w-max">
        Manage Downloads
      </span>

      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <tbody>
          {areas.map((area, index) => {
            const jsonStr = JSON.stringify(area.data);
            const blob = new Blob([jsonStr]);
            const byteSize = blob.size;

            const dataSizeGB = (byteSize / (1024 * 1024 * 1024)).toFixed(2);

            return (
              <tr key={area.bboxKey} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  <button
                    onClick={() => handlePreview(area.bboxKey)}
                    className=" text-black border-none px-3 py-1.5 rounded cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <RemoveRedEyeIcon style={{ fontSize: "18px" }} />
                  </button>
                </td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  <button
                    onClick={() => handleDelete(area.bboxKey)}
                    className="bg-red-100 text-red-700 border-none px-3 py-1.5 rounded cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <DeleteIcon className="text-base" />{" "}
                    <span className=" inline-block min-w-max">
                      {dataSizeGB} GB
                    </span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
