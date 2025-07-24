import { LayerSpecification } from "maplibre-gl";

export const baseCoastlineLayer = {
  layer: {
    id: "baseCoastlineLayer",
    type: "fill",
    source: "localBaseCoastlines",
    paint: {
      "fill-color": "#ededed",
      "fill-opacity": 1,
    },
  } as LayerSpecification,
  condition: (mapInstance: any) => !mapInstance.getLayer("baseCoastlineLayer"),
  log: "Layer 'baseCoastlineLayer' added",
};

export const baseCountriesLayer = {
  layer: {
    id: "baseCountriesLayer",
    type: "fill",
    source: "localBaseCountries",
    paint: {
      "fill-outline-color": "#a0a0a0",
      "fill-color": "transparent",
    },
  } as LayerSpecification,
  condition: (mapInstance: any) => !mapInstance.getLayer("baseCountriesLayer"),
  log: "Layer 'baseCountriesLayer' added",
};

export const baseCountryLabelLayer = {
  layer: {
    id: "baseCountryLabelLayer",
    type: "symbol",
    source: "localBaseCountryLabels",
    layout: {
      "text-field": ["get", "name"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 0, 7, 15, 40],
      "text-anchor": "center",
      "text-padding": 5,
    },
    paint: {
      "text-color": "#333333",
      "text-opacity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0,
        0.5,
        3,
        1,
        15,
        0,
      ],
    },
  } as LayerSpecification,
  condition: (mapInstance: any) =>
    !mapInstance.getLayer("baseCountryLabelLayer"),
  log: "Layer 'baseCountryLabelLayer' added",
};

export const baseStatesLayer = {
  layer: {
    id: "baseStatesLayer",
    type: "fill",
    minzoom: 4,
    maxzoom: 14,
    source: "localBaseStates",
    paint: {
      "fill-outline-color": "#a0a0a0",
      "fill-color": "transparent",
      "fill-opacity": ["interpolate", ["linear"], ["zoom"], 0, 1, 10, 1, 14, 0],
    },
  } as LayerSpecification,
  condition: (mapInstance: any) => !mapInstance.getLayer("statesLayer"),
  log: "Layer 'baseStatesLayer' added",
};

export const baseStatesLabelLayer = {
  layer: {
    id: "baseStatesLabelLayer",
    type: "symbol",
    source: "localBaseStatesLabels",
    minzoom: 4,
    maxzoom: 24,
    layout: {
      "text-field": ["get", "name"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 0, 0, 24, 35],
      "text-anchor": "center",
      "text-padding": 5,
    },
    paint: {
      "text-color": "#333333",
    },
  } as LayerSpecification,
  condition: (mapInstance: any) =>
    !mapInstance.getLayer("baseStatesLabelLayer"),
  log: "Layer 'baseStatesLabelLayer' added",
};

export const basePolygonsLayer = {
  layer: {
    id: "basePolygonsLayer",
    type: "fill",
    source: "localBasePolygons",
    minzoom: 15.5,
    maxzoom: 24,
    paint: {
      "fill-color": [
        "case",
        ["==", ["get", "leisure"], "park"],
        "#ccf0d7",
        ["==", ["get", "leisure"], "playground"],
        "#ccf0d7",
        ["!=", ["get", "building"], ["literal", null]],
        "#e8e9ed",
        "transparent",
      ],
      "fill-outline-color": "#000000",
    },
  } as LayerSpecification,
  condition: (mapInstance: any) => !mapInstance.getLayer("basePolygonsLayer"),
  log: "Layer 'basePolygonsLayer' added",
};

export const extrudedBuildingsLayer = {
  layer: {
    id: "extrudedBuildingsLayer",
    type: "fill-extrusion",
    source: "localBasePolygons",
    filter: ["all", ["!=", ["get", "building"], ["literal", null]]],
    minzoom: 15.5,
    maxzoom: 24,
    paint: {
      "fill-extrusion-color": [
        "interpolate",
        ["linear"],
        ["to-number", ["get", "heightInt"], 0],
        0,
        "#D3D3D3",
        200,
        "#FF8C00",
        400,
        "#FFA500",
      ],
      "fill-extrusion-height": ["to-number", ["get", "heightInt"], 0],
      "fill-extrusion-base": 0,
      "fill-extrusion-opacity": 0.65,
    },
  } as LayerSpecification,
  condition: (mapInstance: any) =>
    !mapInstance.getLayer("extrudedBuildingsLayer"),
  log: "Layer 'extrudedBuildingsLayer' added",
};

export const basePolygonsLabelLayer = {
  layer: {
    id: "basePolygonsLabelLayer",
    type: "symbol",
    source: "localBasePolygons",

    minzoom: 15.5,
    maxzoom: 24,
    layout: {
      "text-field": [
        "coalesce",
        ["get", "leisure"],
        ["get", "housename"],
        ["get", "housenumber"],
        ["get", "postcode"],
        ["get", "name"],
        ["get", "building"],
      ],
      "text-size": ["interpolate", ["linear"], ["zoom"], 15.5, 4, 24, 20],
    },
    paint: {
      "text-color": "#333333",
    },
  } as LayerSpecification,
  condition: (mapInstance: any) =>
    !mapInstance.getLayer("basePolygonsLabelLayer"),
  log: "Layer 'basePolygonsLabelLayer' added",
};

export const baseNaturalPolygonsLayer = {
  layer: {
    id: "naturalPolygonsLayer",
    type: "fill",
    source: "localBaseNaturalPolygons",
    minzoom: 8,
    maxzoom: 24,
    paint: {
      "fill-color": [
        "case",
        ["!=", ["get", "water"], ["literal", null]],
        "#89cee0",
        "#ccf0d7",
      ],
      "fill-opacity": 0.75,
      "fill-outline-color": [
        "case",
        ["!=", ["get", "water"], ["literal", null]],
        "#007bd8",
        "#9bf087",
      ],
    },
  } as LayerSpecification,
  condition: (mapInstance: any) =>
    !mapInstance.getLayer("naturalPolygonsLayer"),
  log: "Layer 'naturalPolygonsLayer' added",
};

export const baseNautralPolygonsLabelLayer = {
  layer: {
    id: "baseNaturalPolygonsLabelLayer",
    type: "symbol",
    source: "localBaseNaturalPolygons",
    minzoom: 8,
    maxzoom: 24,
    layout: {
      "text-field": ["coalesce", ["get", "name"]],
      "text-size": ["interpolate", ["linear"], ["zoom"], 8, 4, 24, 20],
    },
    paint: {
      "text-color": "#333333",
    },
  } as LayerSpecification,
  condition: (mapInstance: any) =>
    !mapInstance.getLayer("baseNaturalPolygonsLabelLayer"),
  log: "Layer 'baseNaturalPolygonsLabelLayer' added",
};

export const polygonLayers = {
  basePolygonsLayer,
  baseNaturalPolygonsLayer,
  baseNautralPolygonsLabelLayer,
  baseCoastlineLayer,
  baseCountriesLayer,
  baseCountryLabelLayer,
  baseStatesLayer,
  baseStatesLabelLayer,
  basePolygonsLabelLayer,
};
