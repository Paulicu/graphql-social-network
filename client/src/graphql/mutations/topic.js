import { gql } from '@apollo/client';

export const CREATE_TOPIC = gql`
    mutation CreateTopic($input: TopicInput!) {
        createTopic(input: $input) {
            _id
            title
            description
            createdAtFormatted
            updatedAtFormatted
            author {
                _id
                username
                email
            }
            totalArticles
            status
        }
    }
`;

export const UPDATE_TOPIC = gql`
    mutation UpdateTopic($topicId: ID!, $input: TopicInput!) {
        updateTopic(topicId: $topicId, input: $input) {
            _id
            title
            description
            createdAtFormatted
            updatedAtFormatted
            author {
                _id
                username
                email
            }
            totalArticles
            status
        }
    }
`;

export const DELETE_TOPIC = gql`
    mutation DeleteTopic($topicId: ID!) {
        deleteTopic(topicId: $topicId) {
            _id
            title
            description
            createdAtFormatted
            updatedAtFormatted
            author {
                _id
                username
                email
            }
            totalArticles
            status
        }
    }
`;