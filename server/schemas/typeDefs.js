
// import the gql tagged template function
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }
  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input BookInput {
    bookId: String
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
  }

  type Query {
    user: User
  }
  type Mutation {
    userLogin(email: String!, password: String!): Auth
    newUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookInfo: BookInput!): User
    deleteBook(bookId: ID!): User
  }
`;
module.exports = typeDefs;