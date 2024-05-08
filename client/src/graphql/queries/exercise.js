import { gql } from '@apollo/client';

export const GET_EXERCISES = gql`
    query GetExercises($pagination: PaginationInput, $filters: FiltersInput) {
        exercises(pagination: $pagination, filters: $filters) {
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