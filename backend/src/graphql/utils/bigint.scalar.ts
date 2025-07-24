import { GraphQLScalarType } from "graphql";
import { BigIntResolver } from "graphql-scalars";

export const BigIntScalar = BigIntResolver as GraphQLScalarType;
