import RoadService from "../../services/horizonRoadNetwork";

const queries = {
  async roadByOsmId(_parent: unknown, args: { osmId: number }) {
    return RoadService.getRoadByOsmId(args.osmId);
  },

  async roadsBbox(
    _parent: unknown,
    args: { minLon: number; minLat: number; maxLon: number; maxLat: number;  currentZoom: number;}
  ) {
    return RoadService.getRoadsInBbox(
      args.minLon,
      args.minLat,
      args.maxLon,
      args.maxLat,
      args.currentZoom
    );
  },

  async roadsOffline(
    _parent: unknown,
    args: { minLon: number; minLat: number; maxLon: number; maxLat: number }
  ) {
    return RoadService.getRoadsOffline(
      args.minLon,
      args.minLat,
      args.maxLon,
      args.maxLat
    );
  },
};

const mutations = {};

export const resolvers = { queries, mutations };
