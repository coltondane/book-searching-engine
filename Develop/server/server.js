const express = require('express');
const path = require('path');
const db = require('./config/connection');
// import apollo server instead of routes
const { ApolloServer } = require('@apollo/server');
// const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require("./utils/auth");

// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');

// configure connection with Apollo server and imported typeDefs and resolvers
const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  persistedQueries: false, 
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client/dist")));


app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"))
});


// create a new instance of Apollo Server using GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`Server now running on port ${PORT}!`);
      console.log(server.graphqlPath);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
    });
  });
};

// start server
startApolloServer(typeDefs, resolvers);

startApolloServer(typeDefs, resolvers);


