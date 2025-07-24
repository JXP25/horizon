import { CountryService } from "../../services/naturalEarthCountry";

const queries = {
  async countryByGid(_parent: unknown, args: { gid: number }) {
    return CountryService.getCountryByGid(args.gid);
  },

  async countries() {
    return CountryService.getAllCountries();
  },
};

const mutations = {};

export const resolvers = { queries, mutations };
