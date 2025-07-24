import {
  FeatureCollection,
  Feature,
  Geometry,
  GeoJsonProperties,
  LineString,
} from "geojson";

export function transformCountryLabels(
  data: any
): FeatureCollection<Geometry, GeoJsonProperties> {
  const transformedFeatures = data.countries.features.map((feature: any) => {
    const { gid, name, label_x, label_y } = feature.properties;

    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [label_x, label_y],
      },
      properties: {
        gid,
        name,
      },
    };
  });

  return {
    type: "FeatureCollection",
    features: transformedFeatures,
  };
}

export function transformStatesLabelsData(
  data: any
): FeatureCollection<Geometry, GeoJsonProperties> {
  const transformedFeatures = data.statesBbox.features.map((feature: any) => {
    const { gid, name, labelGeom } = feature.properties;

    return {
      type: "Feature",
      geometry: labelGeom,
      properties: {
        gid: gid,
        name: name,
      },
    };
  });

  return {
    type: "FeatureCollection",
    features: transformedFeatures,
  };
}

export function transformUserLocation(
  lng: number,
  lat: number,
  accuracy: number
): FeatureCollection<Geometry, GeoJsonProperties> {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [lng, lat] },
        properties: { accuracy },
      },
    ],
  };
}
