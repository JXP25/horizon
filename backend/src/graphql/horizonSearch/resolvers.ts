import { SearchService } from "../../services/horizonSearch";

const queries = {
  async search(
    _parent: unknown,
    args: {
      text: string;
      mapLon?: number;
      mapLat?: number;
      limit?: number;
    }
  ) {
    const { text, mapLon = null, mapLat = null, limit = 20 } = args;
    return SearchService.search(text, mapLon, mapLat, limit);
  },
};

const mutations = {};

export const resolvers = { queries, mutations };
