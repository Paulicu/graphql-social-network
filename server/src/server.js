import dotenv from 'dotenv';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { dbConnection }  from './config/dbConnection.js';

import mergedResolvers from './graphql/resolvers/index.js';
import mergedTypeDefs from './graphql/typeDefs/index.js';

dotenv.config();

const server = new ApolloServer({

    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers
});

const PORT = process.env.PORT || 5000;
const { url } = await startStandaloneServer(server, { listen: { port: PORT } });

await dbConnection();

console.log(`🚀  Server ready at: ${url}`);