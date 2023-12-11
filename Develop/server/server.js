const express = require('express');
const path = require('path');
const db = require('./config/connection');
// import apollo server instead of routes
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');

// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');

// configure connection with Apollo server and imported typeDefs and resolvers
const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers
});

const startApolloServer = async () => {
  await server.start();
  
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server));
  
  // if in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on http://localhost:${PORT}`)
      console.log(`🌍 DA GRAF! listening on localhost:${PORT}`)
    })
  });

};

startApolloServer(typeDefs, resolvers);


