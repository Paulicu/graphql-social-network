import { gql } from '@apollo/client';

export const GET_COMMENTS_BY_ARTICLE = gql`
    query GetCommentsByArticle($articleId: ID!) {
        commentsByArticle(articleId: $articleId) {
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