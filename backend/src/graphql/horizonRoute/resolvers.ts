import { RouteService } from '../../services/horizonRoute';

const queries = {
  async routeBetweenPoints(
    _parent: unknown,
    args: {
      startLon: number;
      startLat: number;
      endLon: number;
      endLat: number;
    }
  ) {
    return RouteService.getRouteBetweenPoints(
      args.startLon,
      args.startLat,
      args.endLon,
      args.endLat
    );
  },
};

const mutations = {};

export const resolvers = { queries, mutations };
