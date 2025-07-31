import maplibregl, { Map } from "maplibre-gl";
import { sources } from "../sources";
import { layers } from "../layers";

// Track current bounding boxes for each layer type
// Note: Roads are NOT cached because they depend on zoom level
// (different zoom levels show different road detail levels)
interface BoundingBox {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

interface LayerBoundingBoxes {
  states: BoundingBox | null;
  polygons: BoundingBox | null;
  naturalPolygons: BoundingBox | null;
}

// Global tracking of current bounding boxes
let currentBoundingBoxes: LayerBoundingBoxes = {
  states: null,
  polygons: null,
  naturalPolygons: null,
};

// Check if new bbox is subset of existing bbox
function isSubsetOf(
  newBbox: BoundingBox,
  existingBbox: BoundingBox | null
): boolean {
  if (!existingBbox) return false;

  return (
    newBbox.minLon >= existingBbox.minLon &&
    newBbox.maxLon <= existingBbox.maxLon &&
    newBbox.minLat >= existingBbox.minLat &&
    newBbox.maxLat <= existingBbox.maxLat
  );
}

// Get current map bounds with optional buffer
function getMapBounds(mapInstance: Map, buffer: number = 0): BoundingBox {
  const bounds = mapInstance.getBounds();
  return {
    minLon: bounds.getWest() - buffer,
    minLat: bounds.getSouth() - buffer / 2,
    maxLon: bounds.getEast() + buffer,
    maxLat: bounds.getNorth() + buffer / 2,
  };
}

export function updateBaseStates(
  mapInstance: Map,
  fetchStates: Function,
  currentZoom: number
) {
  const newBbox = getMapBounds(mapInstance);

  // Check if we already have data for this area
  if (isSubsetOf(newBbox, currentBoundingBoxes.states)) {
    console.log("Skipping states fetch - already have data for this area");
    return;
  }

  console.log("Fetching states data for new area");
  currentBoundingBoxes.states = newBbox;

  fetchStates({
    variables: {
      minLon: newBbox.minLon,
      minLat: newBbox.minLat,
      maxLon: newBbox.maxLon,
      maxLat: newBbox.maxLat,
      currentZoom,
    },
  }).catch((err: any) => {
    console.error("fetchStates error:", err);
  });
}

export function updatePolygons(
  mapInstance: Map,
  fetchPolygons: Function,
  limit: number,
  options: {
    buffer?: number;
  } = {}
) {
  const buffer = options.buffer ?? 0.005;
  const newBbox = getMapBounds(mapInstance, buffer);

  // Check if we already have data for this area
  if (isSubsetOf(newBbox, currentBoundingBoxes.polygons)) {
    console.log("Skipping polygons fetch - already have data for this area");
    return;
  }

  console.log("Fetching polygons data for new area");
  currentBoundingBoxes.polygons = newBbox;

  fetchPolygons({
    variables: {
      minLon: newBbox.minLon,
      minLat: newBbox.minLat,
      maxLon: newBbox.maxLon,
      maxLat: newBbox.maxLat,
      limit,
    },
  }).catch((err: any) => console.error("fetchPolygons error:", err));
}

export function updateNaturalPolygons(
  mapInstance: Map,
  fetchNaturalPolygons: Function,
  limit: number,
  options: {
    buffer?: number;
  } = {}
) {
  const buffer = options.buffer ?? 0.005;
  const newBbox = getMapBounds(mapInstance, buffer);

  // Check if we already have data for this area
  if (isSubsetOf(newBbox, currentBoundingBoxes.naturalPolygons)) {
    console.log(
      "Skipping natural polygons fetch - already have data for this area"
    );
    return;
  }

  console.log("Fetching natural polygons data for new area");
  currentBoundingBoxes.naturalPolygons = newBbox;

  fetchNaturalPolygons({
    variables: {
      minLon: newBbox.minLon,
      minLat: newBbox.minLat,
      maxLon: newBbox.maxLon,
      maxLat: newBbox.maxLat,
      limit,
    },
  }).catch((err: any) => console.error("fetchNaturalPolygons error:", err));
}

export function updateRoads(
  mapInstance: Map,
  fetchRoads: Function,
  currentZoom: number
) {
  const buffer = 0.005;
  const bounds = mapInstance.getBounds();
  const minLon = bounds.getWest() - buffer;
  const minLat = bounds.getSouth() - buffer / 2;
  const maxLon = bounds.getEast() + buffer;
  const maxLat = bounds.getNorth() + buffer / 2;

  console.log("Fetching roads data for zoom level:", currentZoom);

  fetchRoads({
    variables: {
      minLon,
      minLat,
      maxLon,
      maxLat,
      currentZoom,
    },
  }).catch((err: any) => console.error("fetchRoads error:", err));
}

// Reset bounding boxes when moving to a completely new area
export function resetBoundingBoxes() {
  currentBoundingBoxes = {
    states: null,
    polygons: null,
    naturalPolygons: null,
  };
  console.log("Reset bounding boxes - moving to new area");
}

export function updateLines(mapInstance: Map, fetchlines: Function) {
  const buffer = 0;
  const bounds = mapInstance.getBounds();
  const minLon = bounds.getWest() - buffer;
  const minLat = bounds.getSouth() - buffer;
  const maxLon = bounds.getEast() + buffer;
  const maxLat = bounds.getNorth() + buffer;

  fetchlines({ variables: { minLon, minLat, maxLon, maxLat } }).catch(
    (err: any) => console.error("fetchlines error:", err)
  );
}

export function updatePoints(mapInstance: Map, fetchPoints: Function) {
  const buffer = 0;
  const bounds = mapInstance.getBounds();
  const minLon = bounds.getWest() - buffer;
  const minLat = bounds.getSouth() - buffer;
  const maxLon = bounds.getEast() + buffer;
  const maxLat = bounds.getNorth() + buffer;

  fetchPoints({ variables: { minLon, minLat, maxLon, maxLat } }).catch(
    (err: any) => console.error("fetchPoints error:", err)
  );
}

export function updateRoute(
  fetchNavigationRoute: Function,
  startCoord: [number, number],
  endCoord: [number, number]
) {
  fetchNavigationRoute({
    variables: {
      startLon: startCoord[0],
      startLat: startCoord[1],
      endLon: endCoord[0],
      endLat: endCoord[1],
    },
  }).catch((err: any) => console.error("fetchNavigationRoute error:", err));
}

export function initializeMapSourcesAndLayers(mapInstance: maplibregl.Map) {
  sources.forEach((source) => {
    if (source.condition && !source.condition(mapInstance)) {
      return;
    }
    mapInstance.addSource(source.id, {
      ...source.options,
    });
  });

  layers.forEach((layerDef) => {
    if (layerDef.condition && !layerDef.condition(mapInstance)) {
      return;
    }
    mapInstance.addLayer(layerDef.layer);
  });
}
