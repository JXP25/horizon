import { LayerSpecification } from "maplibre-gl";

export const lineLayer: {
  layer: LayerSpecification;
  condition: (mapInstance: any) => boolean;
  log: string;
} = {
  layer: {
    id: "lineLayer",
    type: "line",
    source: "localLines",
    minzoom: 13,
    maxzoom: 24,
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#d1cfcf",
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 11, 0, 12, 1], 
      "line-width": ["interpolate", ["linear"], ["zoom"], 13, 3, 20, 15], 
    },
  },
  condition: (mapInstance: any) => !mapInstance.getLayer("lineLayer"),
  log: "Layer 'lineLayer' added",
};
