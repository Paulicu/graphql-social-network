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

export const GET_WORKOUT = gql`
    query GetWorkout($workoutId: ID!) {
        workout(workoutId: $workoutId) {
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
            exercises {
                exercise {
                    name
                    bodyPart
                    equipment
                    gifUrl
                    target
                    secondaryMuscles
                    instructions
                }
                sets
                repetitions
            }
        }
    }
`;