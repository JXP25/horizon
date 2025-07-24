import { StateService } from "../../services/naturalEarthStates";

const queries = {
  async statesBbox(
    _parent: unknown,
    args: {
      minLon: number;
      minLat: number;
      maxLon: number;
      maxLat: number;
      currentZoom: number;
    }
  ) {
    return StateService.getStatesInBbox(
      args.minLon,
      args.minLat,
      args.maxLon,
      args.maxLat,
      args.currentZoom
    );
  },

  async statesOffline() {
    return StateService.getOfflineStates();
  },
 
};

const mutations = {};

export const resolvers = { queries, mutations };
