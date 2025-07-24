import { GeoJSONSourceSpecification } from "maplibre-gl";


export const localLines: {
  id: string;
  options: GeoJSONSourceSpecification;
  condition: (mapInstance: any) => boolean;
  log: string;
} = {
  id: "localLines",
  options: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  },

  condition: (mapInstance: any) => !mapInstance.getSource("localLines"),
  log: "GeoJSON source 'localLines' added",
};
