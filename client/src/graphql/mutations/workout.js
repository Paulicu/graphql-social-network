import { gql } from '@apollo/client';

export const CREATE_WORKOUT = gql`
    mutation CreateWorkout($input: WorkoutInput!) {
        createWorkout(input: $input) {
            _id
            author {
                _id
                fullName
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

export const DELETE_WORKOUT = gql`
    mutation DeleteWorkout($workoutId: ID!) {
        deleteWorkout(workoutId: $workoutId) {
            _id
            title
        }
    }
`;
