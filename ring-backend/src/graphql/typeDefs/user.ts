import gql from "graphql-tag"

// have to make type defs in graphql string - import gql
// make sure to use back tick after gql
const typeDefs = gql`
  type User {
    id: String
    name: String
    username: String
    email: String
    emailVerified: Boolean
    image: String
  }

  type SearchedUser {
    id: String
    username: String
    banned: Boolean
  }

  type Query {
    searchUsers(username: String): [User]
  }

  type Mutation {
    createUsername(username: String): CreateUsernameResponse
  }
# have to create a response for creation success or error
  type CreateUsernameResponse {
    success: Boolean
    error: String
  }

`;

export default typeDefs;