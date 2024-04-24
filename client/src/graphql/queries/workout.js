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
                    id
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

export const GET_WORKOUTS_BY_AUTHOR = gql`
    query GetWorkoutsByAuthor($authorId: ID!) {
        workoutsByAuthor(authorId: $authorId) {
            _id
            title
        }
    }
`;