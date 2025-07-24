import { LayerSpecification } from "maplibre-gl";



const roadLayer: {
  layer: LayerSpecification;
  condition: (mapInstance: any) => boolean;
  log: string;
} = {
  layer: {
    id: "roadLayer",
    type: "line",
    source: "localRoads",
    minzoom: 6,
    maxzoom: 24,
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": [
        "case",
        ["==", ["get", "highway"], "motorway"], "#FF4500",
        ["==", ["get", "highway"], "trunk"], "#FF6347",
        ["==", ["get", "highway"], "primary"], "#ff8c00",
        ["==", ["get", "highway"], "secondary"], "#90a4bf",
        ["==", ["get", "highway"], "tertiary"], "#b0bec5",
        "#d1cfcf"
      ],
      "line-opacity": 1,
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        11,
        [
          "case",
          ["==", ["get", "highway"], "motorway"], 1.2,
          ["==", ["get", "highway"], "trunk"], 1.2,
          ["==", ["get", "highway"], "primary"], 1,
          ["==", ["get", "highway"], "secondary"], 0.8,
          0.6
        ],
        20,
        [
          "case",
          ["==", ["get", "highway"], "motorway"], 9,
          ["==", ["get", "highway"], "trunk"], 8,
          ["==", ["get", "highway"], "primary"], 7,
          ["==", ["get", "highway"], "secondary"], 6,
          5
        ]
      ],
    },
  },
  condition: (mapInstance: any) => !mapInstance.getLayer("roadLayer"),
  log: "Layer 'roadLayer' added",
};

const roadLabelLayer: {
  layer: LayerSpecification;
  condition: (mapInstance: any) => boolean;
  log: string;
} = {
  layer: {
    id: "roadLabelLayer",
    type: "symbol",
    source: "localRoads",
    minzoom: 3,
    maxzoom: 24,
    layout: {
      "symbol-placement": "line",
      "text-field": [
        "step",
        ["zoom"],
        ["get", "ref"],
        10,
        ["get", "name"]
      ],
      "text-size": 12,
      "text-rotation-alignment": "map",
    },
    paint: {},
  },
  condition: (mapInstance: any) => !mapInstance.getLayer("roadLabelLayer"),
  log: "Layer 'roadLabelLayer' added",
};





export const roadLayers = {
  roadLayer,
  roadLabelLayer,

}