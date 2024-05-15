import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { typePolicies } from './utils/policies.js';

const httpLink = new HttpLink({
    uri: "http://localhost:5000/graphql",
    credentials: "include"
});

const wsLink = new GraphQLWsLink(createClient({
    url: "ws://localhost:5000/graphql"
}));

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    httpLink
);

const client = new ApolloClient({
    link: splitLink,
    uri: "/graphql",
    cache: new InMemoryCache({ typePolicies }),
    credentials: "include" 
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ApolloProvider client={ client }>
                <App />
            </ApolloProvider>
        </BrowserRouter>
    </React.StrictMode>
);