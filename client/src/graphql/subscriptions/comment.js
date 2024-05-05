import { gql } from '@apollo/client';

export const NEW_COMMENT_SUBSCRIPTION = gql`
    subscription OnCommentAdded($articleId: ID!) {
        newCommentSubscription(articleId: $articleId) {
            _id
            content
            createdAtFormatted
            updatedAtFormatted
            author {
                _id
                fullName
                profilePicture
            }
        }
    }
`;