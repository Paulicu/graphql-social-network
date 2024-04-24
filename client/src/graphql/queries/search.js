import { gql } from '@apollo/client';

export const SEARCH = gql`
    query Search($contains: String) {
        search(contains: $contains) {
            __typename
            ... on Article {
                _id
                title
                content
            }
            ... on Exercise {
                id
                name
                bodyPart
            }
            ... on Workout {
                _id
                title
                difficulty
            }
            ... on Program {
                _id
                title
                goal
            }
        }
    }
`;