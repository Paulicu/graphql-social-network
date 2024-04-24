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

export const UPDATE_WORKOUT_INFO = gql`
    mutation UpdateWorkoutInfo($workoutId: ID!, $input: WorkoutInfoInput!) {
        updateWorkoutInfo(workoutId: $workoutId, input: $input) {
            _id
            title
            difficulty
            description
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

export const ADD_EXERCISE_TO_WORKOUT = gql`
    mutation AddExerciseToWorkout($workoutId: ID!, $input: ExerciseInput!) {
        addExerciseToWorkout(workoutId: $workoutId, input: $input) {
            equipment
            muscleGroups
            exercises {
                sets
                repetitions
                exercise {
                    id
                    name
                    equipment
                    target
                }
            }
        }
    }
`;

export const REMOVE_EXERCISE_FROM_WORKOUT = gql`
    mutation RemoveExerciseFromWorkout($workoutId: ID!, $exerciseId: String!) {
        removeExerciseFromWorkout(workoutId: $workoutId, exerciseId: $exerciseId) {
            equipment
            muscleGroups
            exercises {
                sets
                repetitions
                exercise {
                    id
                    equipment
                    target
                }
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
