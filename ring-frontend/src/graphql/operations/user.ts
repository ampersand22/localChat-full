// where we put in all of graphql query strings for users
import { gql } from "@apollo/client";

export default {
  Queries: {
    searchUsers: gql`
      query SearchUsers($username: String!) {
        searchUsers(username: $username) {
          id
          username
        }
      }
    `
  },
  Mutations: {
    //will map to graphql query string
    // $ - declares type, ! - indicate its mandatory
    // username is an input
    createUsername: gql`
      mutation CreateUsername($username: String!) {
        createUsername(username: $username) {
          # this is saying what fields you want back from response from username resolver
          success
          error
        }
      }
    `,
  },
  Subscriptions: {},
}