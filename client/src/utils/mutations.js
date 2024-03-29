import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!){
        userLogin(email: $email, password: $password) {
            token
            user {
              _id,
              username
            }
          }
    }`;

export const ADD_USER = gql`
    mutation newUser($username: String!, $email: String!, $password: String!){
        newUser(username: $username, email: $email, password: $password){
            token
            user{
                _id
                username
            }
        }
    }`;

export const SAVE_BOOK = gql`
    mutation saveBook($bookId: ID!){
        saveBook(input: $input){
            _id
            username
            email
            bookCount
            savedBooks{
                _id
                authors
                description
                title
                image
                link
            }
        }
    }`;

export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: ID!){
        removeBook(bookId: $bookId){
            _id
            username
            email
            bookCount
            savedBooks{
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }`;