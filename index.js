import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setContext } from 'apollo-link-context';

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, HttpLink } from '@apollo/client';

let httpLink = createHttpLink({
    uri: `http://192.168.1.116:4000/`
});

const outhLink = setContext( async (_, { headers }) => {
    // leer el token
    const token = await AsyncStorage.getItem('@user_key')
    //console.log(token, 'Desde Index Native')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
} );

let cliente = new ApolloClient({
    link: outhLink.concat(httpLink),
    cache: new InMemoryCache()
})

let upTaskApp = () => (
    <ApolloProvider client={cliente}>
        <App />
    </ApolloProvider>
)

AppRegistry.registerComponent(appName, () => upTaskApp);


/*
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const cliente = new ApolloClient({
    uri: `http://localhost:4000/`,
    cache: new InMemoryCache()
});

const upTaskApp = () => (
    <ApolloProvider client={cliente}>
        <App />
    </ApolloProvider>
);

*/