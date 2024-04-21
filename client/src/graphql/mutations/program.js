import { gql } from '@apollo/client';

export const DELETE_PROGRAM = gql`
    mutation DeleteProgram($programId: ID!) {
        deleteProgram(programId: $programId) {
            _id
            title
        }
    }
`;