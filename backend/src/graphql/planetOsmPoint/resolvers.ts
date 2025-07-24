import PointService from "../../services/planetOsmPoint";

const queries = {
  async pointByOsmId(_parent: unknown, args: { osmId: number }) {
    return PointService.getPointByOsmId(args.osmId);
  },

  async pointsInBbox(
    _parent: unknown,
    args: { minLon: number; minLat: number; maxLon: number; maxLat: number }
  ) {
    return PointService.getPointsInBbox(
      args.minLon,
      args.minLat,
      args.maxLon,
      args.maxLat
    );
  },

  async pointsByAmenity(
    _parent: unknown,
    args: {
      minLon: number;
      minLat: number;
      maxLon: number;
      maxLat: number;
      amenity: string;
    }
  ) {
    return PointService.getPointsByAmenity(
      args.minLon,
      args.minLat,
      args.maxLon,
      args.maxLat,
      args.amenity
    );
  },

  async amenitiesInBbox(
    _parent: unknown,
    args: { minLon: number; minLat: number; maxLon: number; maxLat: number }
  ) {
    return PointService.getAmenitiesInBbox(
      args.minLon,
      args.minLat,
      args.maxLon,
      args.maxLat
    );
  },
};

const mutations = {};

export const resolvers = { queries, mutations };
