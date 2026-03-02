import { GraphQLClient } from "graphql-request";

const URL = process.env.SQUID_URL || "http://localhost:4350/graphql";
export const squidClient = new GraphQLClient(URL, {
  headers: {
    "Content-Type": "application/json",
  },
});
