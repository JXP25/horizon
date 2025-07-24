import { ApolloServer } from "@apollo/server";
import { User } from "./horizonUser";
import { Point } from "./planetOsmPoint";
import { Polygon } from "./planetOsmPolygon";
import { Road } from "./horizonRoadNetwork";
import { Line } from "./planetOsmLine";
import { Coastline } from "./naturalEarthCoastline";
import { Country } from "./naturalEarthCountry";
import {States} from "./naturalEarthStates";
import {Search} from "./horizonSearch";
import {Route} from "./horizonRoute";
import { BigIntScalar } from "./utils/bigint.scalar";
import GraphQLJSON from "graphql-type-json";

async function createApolloGraphqlServer() {
  const gqlServer = new ApolloServer({
    typeDefs: `
              ${User.typeDefs}
              ${Point.typeDefs}
              ${Polygon.typeDefs}
              ${Road.typeDefs}
              ${Line.typeDefs}
              ${Coastline.typeDefs}
              ${Country.typeDefs}
              ${States.typeDefs}
              ${Route.typeDefs}
              ${Search.typeDefs}

            type Query {
              ${User.queries}
              ${Point.queries}
              ${Polygon.queries}
              ${Road.queries}
              ${Line.queries}
              ${Coastline.queries}
              ${Country.queries}
              ${States.queries}
              ${Route.queries}
              ${Search.queries}
            }

            type Mutation {
              ${User.mutations}
              ${Point.mutations}
              ${Polygon.mutations}
              ${Road.mutations}
              ${Line.mutations}
              ${Coastline.mutations}
              ${Country.mutations}
              ${States.mutations}
              ${Route.mutations}
              ${Search.mutations}
            }
        `,
    resolvers: {
      BigInt: BigIntScalar,
      JSON: GraphQLJSON,
      Query: {
        ...User.resolvers.queries,
        ...Point.resolvers.queries,
        ...Polygon.resolvers.queries,
        ...Road.resolvers.queries,
        ...Line.resolvers.queries,
        ...Coastline.resolvers.queries,
        ...Country.resolvers.queries,
        ...States.resolvers.queries,
        ...Route.resolvers.queries,
        ...Search.resolvers.queries,
      },
      Mutation: {
        ...User.resolvers.mutations,
        ...Point.resolvers.mutations,
        ...Polygon.resolvers.mutations,
        ...Road.resolvers.mutations,
        ...Line.resolvers.mutations,
        ...Coastline.resolvers.mutations,
        ...Country.resolvers.mutations,
        ...States.resolvers.mutations,
        ...Route.resolvers.mutations,
        ...Search.resolvers.mutations,
      },
    },
  });

  await gqlServer.start();

  return gqlServer;
}

export default createApolloGraphqlServer;
