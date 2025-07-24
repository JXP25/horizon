import { pointLayers } from "./point";
import { roadLayers } from "./road";
import { lineLayer } from "./line";

import { polygonLayers } from "./polygon";

export const layers = [
  polygonLayers.baseCoastlineLayer,
  polygonLayers.baseCountriesLayer,
  polygonLayers.baseStatesLayer,
  polygonLayers.basePolygonsLayer,
  polygonLayers.baseNaturalPolygonsLayer,

  roadLayers.roadLayer,


  polygonLayers.baseCountryLabelLayer,
  polygonLayers.baseStatesLabelLayer,
  polygonLayers.baseNautralPolygonsLabelLayer,
  polygonLayers.basePolygonsLabelLayer,


  roadLayers.roadLabelLayer,

  pointLayers.userLocationLayer,
];
