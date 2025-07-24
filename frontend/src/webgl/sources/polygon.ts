import { GeoJSONSourceSpecification } from "maplibre-gl";

const localBaseCoastlines = {
  id: "localBaseCoastlines",
  options: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  } as GeoJSONSourceSpecification,
  condition: (mapInstance: any) => !mapInstance.getSource("localBaseCoastlines"),
  log: "GeoJSON source 'localBaseCoastlines' added",
};


const localBaseCountries = {
  id: "localBaseCountries",
  options: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  } as GeoJSONSourceSpecification,
  condition: (mapInstance: any) => !mapInstance.getSource("localBaseCountries"),
  log: "GeoJSON source 'localBaseCountries' added",
};

const localBaseCountryLabels = {
  id: "localBaseCountryLabels",
  options: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  } as GeoJSONSourceSpecification,
  condition: (mapInstance: any) =>
    !mapInstance.getSource("localBaseCountryLabels"),
  log: "GeoJSON source 'localBaseCountryLabels' added",
};

const localBaseStates = {
  id: "localBaseStates",
  options: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  } as GeoJSONSourceSpecification,
  condition: (mapInstance: any) => !mapInstance.getSource("localStates"),
  log: "GeoJSON source 'localStates' added",
};

const localBaseStatesLabels = {
  id: "localBaseStatesLabels",
  options: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  } as GeoJSONSourceSpecification,
  condition: (mapInstance: any) => !mapInstance.getSource("localBaseStatesLabels"),
  log: "GeoJSON source 'localBaseStatesLabels' added",
};


/**
 * Base Land Polygons (large polygon covering entire landmass).
 * Typically loaded once and always visible as a background.
 */
const localBasePolygons = {
  id: "localBasePolygons",
  options: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  } as GeoJSONSourceSpecification,
  condition: (mapInstance: any) =>
    !mapInstance.getSource("localBaseLandPolygons"),
  log: "GeoJSON source 'localBaseLandPolygons' added",
};


const localBaseNaturalPolygons = {
  id: "localBaseNaturalPolygons",
  options: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  } as GeoJSONSourceSpecification,
  condition: (mapInstance: any) =>
    !mapInstance.getSource("localBaseNaturalPolygons"),
  log: "GeoJSON source 'localBaseNaturalPolygons' added",
};



export const polygonSources = [
  localBasePolygons,
  localBaseNaturalPolygons,
  localBaseCoastlines,
  localBaseCountries,
  localBaseCountryLabels,
  localBaseStates,
  localBaseStatesLabels,
];