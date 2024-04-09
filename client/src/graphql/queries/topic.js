import { gql } from '@apollo/client';

export const GET_TOPICS = gql`
    query GetTopics {
        topics {
            _id
            title
            status
            totalArticles
        }
    }
`;