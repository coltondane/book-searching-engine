import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    {
        user{
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