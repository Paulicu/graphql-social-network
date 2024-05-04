import { gql } from '@apollo/client';

export const GET_AUTHENTICATED_USER = gql`
    query GetAuthenticatedUser {
        authUser {
            _id
            firstName
            profilePicture
            role
        }
    }
`;

export const GET_USERS = gql`
    query GetUsers {
        users {
            _id
            fullName
            profilePicture
            role
            gender
            email
            createdAtFormatted
            username
        }
    }
`;