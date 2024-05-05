import { gql } from '@apollo/client';

export const NEW_PROGRAM_SUBSCRIPTION = gql`
    subscription OnProgramAdded {
        newProgramSubscription {
            _id
            title
            goal
            createdAtFormatted
            updatedAtFormatted
            totalWorkouts
            totalRatings
            averageRating
            author {
                _id
                fullName
                profilePicture
            }
        }
    }
`;