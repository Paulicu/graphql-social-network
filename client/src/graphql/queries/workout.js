import { gql } from '@apollo/client';

export const GET_WORKOUTS = gql`
    query GetWorkouts {
        workouts {
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