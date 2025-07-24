import PolygonService from "../../services/horizonPolygon";

const queries = {
  async polygonByOsmId(_parent: unknown, args: { osmId: number }) {
    return PolygonService.getPolygonByOsmId(args.osmId);
  },

  async polygonsBbox(
    _parent: unknown,
    args: {
      minLon: number;
      minLat: number;
      maxLon: number;
      maxLat: number;
      limit: number;
    }
  ) {
    return PolygonService.getpolygonsBbox(
      args.minLon,
      args.minLat,
      args.maxLon,
      args.maxLat,
      args.limit
    );
  },

  async naturalPolygonsBbox(
    _parent: unknown,
    args: {
      minLon: number;
      minLat: number;
      maxLon: number;
      maxLat: number;
      limit: number;
    }
  ) {
    return PolygonService.getNaturalpolygonsBbox(
      args.minLon,
      args.minLat,
      args.maxLon,
      args.maxLat,
      args.limit
    );
  },

  async polygonsByAmenity(_parent: unknown, args: { amenity: string }) {
    return PolygonService.getPolygonsByAmenity(args.amenity);
  },
};

const mutations = {};

export const resolvers = { queries, mutations };
