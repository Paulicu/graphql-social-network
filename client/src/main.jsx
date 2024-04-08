import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient(
{
    uri: 'http://localhost:5000/graphql',
    cache: new InMemoryCache(), 
    credentials: "include" 
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ApolloProvider client={ client }>
                <App />
            </ApolloProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
