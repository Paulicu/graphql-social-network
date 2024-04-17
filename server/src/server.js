import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongodb-session';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import { buildContext } from 'graphql-passport';
import { dbConnection }  from './config/dbConnection.js';
import { authConfig } from './config/authConfig.js';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import mergedResolvers from './graphql/resolvers/index.js';
import mergedTypeDefs from './graphql/typeDefs/index.js';
import ExercisesAPI from './utils/exercises-api.js';

dotenv.config();
authConfig();

const app = express();
const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);
const store = new MongoDBStore(
{
    uri: process.env.MONGO_URI,
    collection: "sessions"
});
store.on("error", (err) => console.log(err)); 

app.use(session(
    {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true 
        },
        store: store
    })
);

app.use(passport.initialize());
app.use(passport.session());

const typeDefs = mergedTypeDefs;
const resolvers = mergedResolvers;

const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = new WebSocketServer(
{
    server: httpServer,
    path: '/graphql',
});

const serverCleanup = useServer({ schema }, wsServer);
  
const server = new ApolloServer(
{
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ]
});

await server.start();

app.use(
    "/graphql",
    cors({ origin: "http://localhost:3000", credentials: true }), 
    express.json(),
    expressMiddleware(server, 
    { 
        context: async ({ req, res }) => {
            const authContext = buildContext({ req, res });
            const { cache } = server;
            return {
                ...authContext,
                dataSources: {
                    exercisesAPI: new ExercisesAPI({ cache })
                }
            }
        }
    })
);

const PORT = process.env.PORT || 5000;
await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

await dbConnection();

console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);