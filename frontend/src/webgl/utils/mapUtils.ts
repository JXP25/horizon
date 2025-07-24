import maplibregl, { Map } from "maplibre-gl";
import { sources } from "../sources";
import { layers } from "../layers";

export function updateBaseStates(
  mapInstance: Map,
  fetchStates: Function,
  currentZoom: number
) {
  const bounds = mapInstance.getBounds();
  const minLon = bounds.getWest();
  const minLat = bounds.getSouth();
  const maxLon = bounds.getEast();
  const maxLat = bounds.getNorth();

  fetchStates({
    variables: {
      minLon,
      minLat,
      maxLon,
      maxLat,
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
  const bounds = mapInstance.getBounds();
  const minLon = bounds.getWest() - buffer;
  const minLat = bounds.getSouth() - buffer/2;
  const maxLon = bounds.getEast() + buffer;
  const maxLat = bounds.getNorth() + buffer/2;

  fetchPolygons({
    variables: {
      minLon,
      minLat,
      maxLon,
      maxLat,
      limit,
    },
  }).catch((err: any) => console.error("fetchPolygons error:", err));
}

export function updateRoads(
  mapInstance: Map,
  fetchRoads: Function,
  currentZoom: number
) {
  const buffer = 0.005;
  const bounds = mapInstance.getBounds();
  const minLon = bounds.getWest() - buffer;
  const minLat = bounds.getSouth() - buffer/2;
  const maxLon = bounds.getEast() + buffer;
  const maxLat = bounds.getNorth() + buffer/2;

  fetchRoads({
    variables: { minLon, minLat, maxLon, maxLat, currentZoom },
  }).catch((err: any) => console.error("fetchRoads error:", err));
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
