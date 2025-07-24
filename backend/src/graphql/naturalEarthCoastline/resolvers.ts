import { CoastlineService } from "../../services/naturalEarthCoastline";

const queries = {
  async coastlineByGid(_parent: unknown, args: { gid: number }) {
    return CoastlineService.getCoastlineByGid(args.gid);
  },

  async coastlines() {
    return CoastlineService.getBaseCoastlinePolygons();
  },
};

const mutations = {};

export const resolvers = { queries, mutations };
