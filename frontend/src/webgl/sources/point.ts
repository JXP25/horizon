import {
  GeoJSONSourceSpecification
} from "maplibre-gl";

const localPoints: {
  id: string;
  options: GeoJSONSourceSpecification;
  condition: (mapInstance: any) => boolean;
  log: string;
} = {
  id: "localPoints",
  options: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  },

  condition: (mapInstance: any) => !mapInstance.getSource("localPoints"),
  log: "GeoJSON source 'localPoints' added",
};


const localUserLocation: {
  id: string;
  options: GeoJSONSourceSpecification;
  condition: (map: any) => boolean;
  log: string;
} = {
  id: "localUserLocation",
  options: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],         
    },
  },
  condition: (map) => !map.getSource("localUserLocation"),
  log: "GeoJSON source 'localUserLocation' added",
};

export const pointSources = [
  localPoints,
  localUserLocation,
];