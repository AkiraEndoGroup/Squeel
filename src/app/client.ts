import { ApolloClient, createNetworkInterface } from 'apollo-client';

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj75aghwr1byq0177u0kv023b'
});

// The x-graphcool-source header is to let the server know that the example app has started.
// (Not necessary for normal projects)
networkInterface.use([{
  applyMiddleware (req, next) {
    if (!req.options.headers) {
      // Create the header object if needed.
      req.options.headers = {};
    }
    req.options.headers = {};

    if (localStorage.getItem('graphcoolToken')){
        req.options.headers['Authorization'] = `Bearer ${localStorage.getItem('graphcoolToken')}`
    }
    // req.options.headers['authorization'] = localStorage.getItem('token') || null;
    next();
  },
}]);

const client = new ApolloClient({ networkInterface });

export function provideClient(): ApolloClient {
  return client;
}
