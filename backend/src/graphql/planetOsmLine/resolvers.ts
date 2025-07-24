import LineService from "../../services/planetOsmLine";

const queries = {
  async lineByOsmId(_parent: unknown, args: { osmId: number }) {
    return LineService.getLineByOsmId(args.osmId);
  },

  async linesInBbox(
    _parent: unknown,
    args: { minLon: number; minLat: number; maxLon: number; maxLat: number }
  ) {
    return LineService.getLinesInBbox(
      args.minLon,
      args.minLat,
      args.maxLon,
      args.maxLat
    );
  },

  async linesByAmenity(_parent: unknown, args: { amenity: string }) {
    return LineService.getLinesByAmenity(args.amenity);
  },
};

const mutations = {};

export const resolvers = { queries, mutations };
