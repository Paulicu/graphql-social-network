import { gql } from '@apollo/client';

export const GET_RATINGS_BY_PROGRAM = gql`
    query GetRatingsByProgram($programId: ID!) {
        ratingsByProgram(programId: $programId) {
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