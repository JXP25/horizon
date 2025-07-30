import React, { useState, useEffect } from "react";
import { Map } from "maplibre-gl";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { toast } from "react-hot-toast";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ClearIcon from "@mui/icons-material/Clear";
import { GET_ROUTE_BETWEEN_POINTS } from "@/graphql/query/navigation";
import { SEARCH } from "@/graphql/query/search";
import { useLazyQuery } from "@apollo/client";
import { updateRoute } from "../utils/mapUtils";
import maplibregl from "maplibre-gl";

interface SearchBarProps {
  map: Map;
}

const ROUTE_TOAST_ID = "route-toast";
const sourceId = "routeSource";
const layerId = "routeLayer";
const startSrcId = "startPointSource";
const startLyrId = "startPointLayer";
const endSrcId = "endPointSource";
const endLyrId = "endPointLayer";

const SearchBar: React.FC<SearchBarProps> = ({ map }) => {
  const [query, setQuery] = useState("");
  const [navigate, setNavigate] = useState(false);

  const [startQuery, setStartQuery] = useState("");
  const [endQuery, setEndQuery] = useState("");

  const [isStartLocked, setIsStartLocked] = useState(false);
  const [isEndLocked, setIsEndLocked] = useState(false);

  const [startPinMode, setStartPinMode] = useState(false);
  const [endPinMode, setEndPinMode] = useState(false);

  const [startCoord, setStartCoord] = useState<[number, number] | null>(null);
  const [endCoord, setEndCoord] = useState<[number, number] | null>(null);

  const searchMarkerRef = React.useRef<maplibregl.Marker | null>(null);

  const [
    fetchNavigationRoute,
    { data: routeData, loading: routeLoading, error: routeError },
  ] = useLazyQuery(GET_ROUTE_BETWEEN_POINTS);

  const [fetchSearch, { data: searchData, loading: searchLoading }] =
    useLazyQuery(SEARCH);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    const center = map.getCenter();
    const res = await fetchSearch({
      variables: {
        text: query,
        mapLon: center.lng,
        mapLat: center.lat,
        limit: 1,
      },
    });

    const hit = res.data?.search?.[0];
    if (!hit) {
      toast.error("No results found.");
      return;
    }

    const [lon, lat] = hit.geom.coordinates;
    map.flyTo({ center: [lon, lat], zoom: 14 });
  };

  const handleRoute = () => {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
    if (routeLoading) {
      toast.error("Cancelled", { id: ROUTE_TOAST_ID });
      return;
    }
    if (startCoord) {
      setStartCoord(null);
      setIsStartLocked(false);
    }
    if (endCoord) {
      setEndCoord(null);
      setIsEndLocked(false);
    }
    setNavigate(!navigate);
  };

  const handleClearStart = () => {
    setStartCoord(null);
    setIsStartLocked(false);
    setStartQuery("");
    toast("Start location cleared");
  };

  const handleClearEnd = () => {
    setEndCoord(null);
    setIsEndLocked(false);
    setEndQuery("");
    toast("End location cleared");
  };

  async function handleSearchField(
    e: React.FormEvent,
    field: "start" | "end",
    queryValue: string
  ) {
    e.preventDefault();
    if (!queryValue) return;

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        queryValue
      )}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Geocoding request failed");

      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        if (field === "start") {
          setStartCoord([longitude, latitude]);

          setIsStartLocked(true);
          toast.success("Starting point set");
          map.setCenter([longitude, latitude]);
        } else {
          setEndCoord([longitude, latitude]);
          setIsEndLocked(true);
          toast.success("Ending point set");
          map.setCenter([longitude, latitude]);
        }
        map.setZoom(14);
      } else {
        toast.error("No results found.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      toast.error("Geocoding error. Check the console for details.");
    }
  }

  useEffect(() => {
    if (!map) return;

    function handleMapClick(e: any) {
      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;

      if (startPinMode && !isStartLocked) {
        setStartCoord([lng, lat]);
        setIsStartLocked(true);
        setStartPinMode(false);
        toast.success("Start coordinate set from map!");
      } else if (endPinMode && !isEndLocked) {
        setEndCoord([lng, lat]);
        setIsEndLocked(true);
        setEndPinMode(false);
        toast.success("End coordinate set from map!");
      }
    }

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, startPinMode, endPinMode, isStartLocked, isEndLocked]);

  useEffect(() => {
    if (!map) return;

    if (startCoord) {
      const feature: GeoJSON.Feature = {
        type: "Feature",
        geometry: { type: "Point", coordinates: startCoord },
        properties: {},
      };

      if (!map.getSource(startSrcId)) {
        map.addSource(startSrcId, { type: "geojson", data: feature });
      } else {
        (map.getSource(startSrcId) as maplibregl.GeoJSONSource).setData(
          feature
        );
      }

      if (!map.getLayer(startLyrId)) {
        map.addLayer({
          id: startLyrId,
          type: "symbol",
          source: startSrcId,
          layout: {
            "icon-image": "pulsing-dot",
          },
        });
      }
    } else {
      if (map.getLayer(startLyrId)) map.removeLayer(startLyrId);
      if (map.getSource(startSrcId)) map.removeSource(startSrcId);
    }
  }, [startCoord, map]);

  useEffect(() => {
    if (!map) return;

    if (endCoord) {
      const feature: GeoJSON.Feature = {
        type: "Feature",
        geometry: { type: "Point", coordinates: endCoord },
        properties: {},
      };

      if (!map.getSource(endSrcId)) {
        map.addSource(endSrcId, { type: "geojson", data: feature });
      } else {
        (map.getSource(endSrcId) as maplibregl.GeoJSONSource).setData(feature);
      }

      if (!map.getLayer(endLyrId)) {
        map.addLayer({
          id: endLyrId,
          type: "symbol",
          source: endSrcId,
          layout: {
            "icon-image": "pulsing-dot",
          },
        });
      }
    } else {
      if (map.getLayer(endLyrId)) map.removeLayer(endLyrId);
      if (map.getSource(endSrcId)) map.removeSource(endSrcId);
    }
  }, [endCoord, map]);

  const handleStartPinToggle = () => {
    if (isStartLocked) return;

    setStartPinMode(!startPinMode);

    if (!startPinMode) setEndPinMode(false);
  };

  const handleEndPinToggle = () => {
    if (isEndLocked) return;

    setEndPinMode(!endPinMode);

    if (!endPinMode) setStartPinMode(false);
  };

  const handleStartRoute = () => {
    if (!startCoord || !endCoord) {
      toast.error("Please set both start and end points");
      return;
    }
    toast.loading("Searching for route...", { id: ROUTE_TOAST_ID });
    updateRoute(fetchNavigationRoute, startCoord, endCoord);
    toast.dismiss(ROUTE_TOAST_ID);
  };

  useEffect(() => {
    if (routeData && map) {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "geojson",
          data: routeData.routeBetweenPoints,
        });
      } else {
        const routeSource = map.getSource(sourceId) as maplibregl.GeoJSONSource;
        if (routeSource) {
          routeSource.setData(routeData.routeBetweenPoints);
        }
      }
      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: "line",
          source: sourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#0089ff",
            "line-width": 6,
          },
        });
      }
      if (map.getLayer(startLyrId)) map.moveLayer(startLyrId);
      if (map.getLayer(endLyrId)) map.moveLayer(endLyrId);
    }
  }, [routeData, map]);

  useEffect(() => {
    if (routeError) {
      toast.error("Route not found", { id: ROUTE_TOAST_ID });
      console.error("GraphQL route query error:", routeError);
    }
  }, [routeError]);

  if (!navigate) {
    return (
      <form
        onSubmit={handleSearch}
        className="py-[7px] px-[14px] bg-white flex items-center  w-[325px] rounded-full shadow-md"
      >
        <input
          type="text"
          placeholder="Search (try 'Hong Kong')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "16px",
            fontFamily:
              query === "" ? "Orbitron, sans-serif" : "Poppins, sans-serif",
          }}
          className="min-w-[200px]"
        />
        <button
          type="submit"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
          }}
          className="flex"
        >
          <SearchIcon className="-translate-y-[1px] ml-2" />
        </button>
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
          }}
          className="flex"
          onClick={handleRoute}
        >
          <DirectionsIcon className="-translate-y-[1px] text-sky-600 ml-3" />
        </button>
      </form>
    );
  }

  return (
    <div className=" min-w-[322.5px]">
      <div className=" absolute py-2 px-4 bg-white flex flex-col z-10  rounded-2xl shadow-md  max-w-[322.5px] ">
        <div className="flex items-center mb-2  ">
          <div className=" flex justify-between w-full items-center">
            <span className="font-orbitron text-lg font-bold">Navigation</span>
            <span
              onClick={handleRoute}
              className=" opacity-70 text-sm cursor-pointer"
            >
              <ChevronLeftIcon />
            </span>
          </div>
        </div>

        <form
          onSubmit={(e) => handleSearchField(e, "start", startQuery)}
          className="flex items-center mb-2 "
        >
          <button
            type="submit"
            className="bg-transparent mr-2 -translate-y-[2px] border-none p-0"
            disabled={isStartLocked}
          >
            <SearchIcon />
          </button>

          <div className="relative w-full mr-2">
            <input
              type="text"
              placeholder="Start location"
              value={startQuery}
              onChange={(e) => setStartQuery(e.target.value)}
              disabled={isStartLocked}
              style={{
                flex: 1,
                fontFamily:
                  startQuery === ""
                    ? "Orbitron, sans-serif"
                    : "Poppins, sans-serif",
              }}
              className="w-full  border p-5 py-2 text-[16px] rounded-full "
            />
            {isStartLocked && (
              <button
                type="button"
                onClick={handleClearStart}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                title="Clear start"
              >
                <ClearIcon />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleStartPinToggle}
            className={` ${startPinMode ? "text-blue-600" : ""} -translate-y-1`}
            style={{ border: "none", background: "none", cursor: "pointer" }}
            title="Pick on Map"
            disabled={isStartLocked}
          >
            <AddLocationAltIcon />
          </button>
        </form>

        <form
          onSubmit={(e) => handleSearchField(e, "end", endQuery)}
          className="flex items-center mb-2"
        >
          <button
            type="submit"
            className="bg-transparent mr-2   border-none p-0 -translate-y-[2px]"
            disabled={isEndLocked}
          >
            <SearchIcon />
          </button>
          <div className="relative w-full mr-2">
            <input
              type="text"
              placeholder="End location"
              value={endQuery}
              onChange={(e) => setEndQuery(e.target.value)}
              disabled={isEndLocked}
              style={{
                flex: 1,
                fontFamily:
                  endQuery === ""
                    ? "Orbitron, sans-serif"
                    : "Poppins, sans-serif",
              }}
              className="w-full border p-5 py-2 text-[16px] rounded-full "
            />
            {isEndLocked && (
              <button
                type="button"
                onClick={handleClearEnd}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                title="Clear end"
              >
                <ClearIcon />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleEndPinToggle}
            className={`${endPinMode ? "text-blue-600" : ""} -translate-y-1`}
            style={{ border: "none", background: "", cursor: "pointer" }}
            title="Pick on Map"
            disabled={isEndLocked}
          >
            <AddLocationAltIcon />
          </button>
        </form>

        <button
          onClick={handleStartRoute}
          disabled={!startCoord || !endCoord}
          className="mt-2 bg-sky-500 text-white px-3 py-1 rounded-full disabled:bg-gray-400"
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
