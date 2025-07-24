import { GeoJSONSourceSpecification } from "maplibre-gl";
const routeSource = {
    id: "localRoute",
    options: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    } as GeoJSONSourceSpecification,
    condition: (map: any) => !map.getSource("localRoute"),
    log: "GeoJSON source 'localRoute' added",
  };


  export const navigationSources = [
    routeSource,
  ];
