import { gql } from '@apollo/client';

export const NEW_ARTICLE_SUBSCRIPTION = gql`
    subscription OnArticleAdded {
        newArticleSubscription {
            _id
            title
            content
            createdAtFormatted
            updatedAtFormatted
            totalComments
            topic {
                _id
                title
            }
            author {
                _id
                fullName
                profilePicture
            }
        }
    }
`;