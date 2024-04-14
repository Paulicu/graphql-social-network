import { gql } from '@apollo/client';

export const ADD_COMMENT = gql`
    mutation AddComment($articleId: ID!, $input: CommentInput!) {
        addComment(articleId: $articleId, input: $input) {
            _id
            content
            createdAtFormatted
            author {
                _id
                fullName
                profilePicture
            }
        }
    }
`;

export const UPDATE_COMMENT = gql`
    mutation UpdateComment($commentId: ID!, $input: CommentInput!) {
        updateComment(commentId: $commentId, input: $input) {
            _id
            content
            updatedAtFormatted
        }
    }
`;

export const DELETE_COMMENT = gql`
    mutation DeleteComment($commentId: ID!) {
        deleteComment(commentId: $commentId) {
            _id
        }
    }
`;