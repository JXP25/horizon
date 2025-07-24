export const typeDefs = `#graphql
  scalar JSON

  type Country {
    gid: Int
    name_long: String
    label_x: Float
    label_y: Float
    geom: JSON
  }

`;
