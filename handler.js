const ApolloServer = require('apollo-server-lambda').ApolloServer
const DynamoDB = require('aws-sdk').DynamoDB
const readFileSync = require('fs').readFileSync
// Partitions library
const generateGraphql = require('@skywap/partitions').generateGraphql

const types = readFileSync('./schema.graphql').toString()

// generateGraphql takes a type definition file and generates your typeDefs and resolvers
const { typeDefs, resolvers } = generateGraphql(types.toString())

const db = new DynamoDB.DocumentClient()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context }) => ({
    context,
    // The only thing Partition's resolvers assumes is a db property representing a dynamo document client in the context
    db,
    event,
  }),
  playground: true,
  introspection: true,
})

exports.graphqlHandler = server.createHandler()