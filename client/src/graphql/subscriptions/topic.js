import { gql } from '@apollo/client';

export const NEW_TOPIC_SUBSCRIPTION = gql`
    subscription OnTopicAdded {
        newTopicSubscription {
            _id
            title
            status
            description
            totalArticles
        }
    }
`;