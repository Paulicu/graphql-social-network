import { gql } from '@apollo/client';

export const GET_EXERCISES = gql`
    query GetExercises {
        exercises {
            id
            name
            bodyPart
            equipment
            gifUrl
            target
        }
    }
`;

export const GET_EXERCISE_BY_ID = gql`
    query GetExerciseById($exerciseId: String!) {
        exerciseById(exerciseId: $exerciseId) {
            id
            name
            bodyPart
            equipment
            gifUrl
            target
            secondaryMuscles
            instructions
        }
    }
`;
