import { GeoJSONSourceSpecification } from "maplibre-gl";

const localRoads: {
  id: string;
  options: GeoJSONSourceSpecification;
  condition: (mapInstance: any) => boolean;
  log: string;
} = {
  id: "localRoads",
  options: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  },

  condition: (mapInstance: any) => !mapInstance.getSource("localRoads"),
  log: "GeoJSON source 'localRoads' added",
};



export const roadSources = [
  localRoads,
]