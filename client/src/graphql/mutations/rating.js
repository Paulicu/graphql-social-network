import { gql } from '@apollo/client';

export const ADD_RATING = gql`
    mutation AddRating($programId: ID!, $input: RatingInput!) {
        addRating(programId: $programId, input: $input) {
            _id
            stars
            message
            createdAtFormatted
            author {
                _id
                fullName
                profilePicture
            }
        }
    }
`;

export const UPDATE_RATING = gql`
    mutation UpdateRating($ratingId: ID!, $input: RatingInput!) {
        updateRating(ratingId: $ratingId, input: $input) {
            _id
            stars
            message
            updatedAtFormatted
        }
    }
`;

export const DELETE_RATING = gql`
    mutation DeleteRating($ratingId: ID!) {
        deleteRating(ratingId: $ratingId) {
            _id
        }
    }
`;