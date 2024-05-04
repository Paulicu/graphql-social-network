import { gql } from '@apollo/client';

export const CREATE_PROGRAM = gql`
    mutation CreateProgram($input: ProgramInput!) {
        createProgram(input: $input) {
            _id
            title
            goal
            days {
                dayNumber
                isRestDay
                workout {
                    _id
                    title
                }
            }
        }
    }
`;

export const UPDATE_PROGRAM = gql`
    mutation UpdateProgram($programId: ID!, $input: ProgramInput!) {
        updateProgram(programId: $programId, input: $input) {
            _id
            title
            goal
            days {
                dayNumber
                isRestDay
                workout {
                    _id
                    title
                }
            }
        }
    }
`;

export const DELETE_PROGRAM = gql`
    mutation DeleteProgram($programId: ID!) {
        deleteProgram(programId: $programId) {
            _id
            title
        }
    }
`;