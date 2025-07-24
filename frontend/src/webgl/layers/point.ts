import { LayerSpecification } from "maplibre-gl";
const pointLayer: {
  layer: LayerSpecification;
  condition: (mapInstance: any) => boolean;
  log: string;
} = {
  layer: {
    id: "pointLayer",
    type: "circle",
    source: "localPoints",
    minzoom: 16,
    maxzoom: 24,
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 16, 0.5, 19, 3],
      "circle-color": "#F0F0F0",
      "circle-stroke-color": "#000000",
      "circle-stroke-width": 1,
      "circle-opacity": 0.8,
    },
  },

  condition: (mapInstance: any) => !mapInstance.getLayer("pointLayer"),
  log: "Layer 'pointLayer' added",
};


const userLocationLayer: {
  layer: LayerSpecification;
  condition: (map: any) => boolean;
  log: string;
} = {
  layer: {
    id: "userLocationLayer",
    type: "circle",
    source: "localUserLocation",
    minzoom: 0,
    paint: {
      "circle-radius": 6,
      "circle-color": "#007aff",        
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  },
  condition: (map) => !map.getLayer("userLocationLayer"),
  log: "Layer 'userLocationLayer' added",
};


export const pointLayers = {
  pointLayer,
  userLocationLayer,
};