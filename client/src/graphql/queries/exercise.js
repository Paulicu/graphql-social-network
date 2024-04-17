import { gql } from '@apollo/client';

export const GET_EXERCISES = gql`
    query GetExercises($equipment: [String], $bodyParts: [String], $targets: [String]) {
        exercises(equipment: $equipment, bodyParts: $bodyParts, targets: $targets) {
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

export const GET_EXERCISE_FILTERS = gql`
    query GetExerciseFilters {
        equipmentList
        bodyPartList
        targetList
    }
`;