import { gql } from '@apollo/client';

export const NEW_WORKOUT_SUBSCRIPTION = gql`
    subscription OnWorkoutAdded {
        newWorkoutSubscription {
            _id
            title
            difficulty
            equipment
            muscleGroups
            totalEquipment
            totalExercises
            totalMuscleGroups
            description
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