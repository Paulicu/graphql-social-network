import { gql } from '@apollo/client';

export const NEW_RATING_SUBSCRIPTION = gql`
    subscription OnRatingAdded($programId: ID!) {
        newRatingSubscription(programId: $programId) {
            _id
            stars
            message
            createdAtFormatted
            updatedAtFormatted
            author {
                _id
                fullName
                profilePicture
            }
        }
    }
`;