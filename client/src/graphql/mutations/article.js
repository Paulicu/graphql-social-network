import { gql } from '@apollo/client';

export const CREATE_ARTICLE = gql`
    mutation CreateArticle($input: ArticleInput!) {
        createArticle(input: $input) {
            _id
            title
            content
            createdAtFormatted
            updatedAtFormatted
            author {
                _id
                username
            }
            topic {
                _id
                title
            }
            totalComments
        }
    }
`;

export const UPDATE_ARTICLE = gql`
    mutation UpdateArticle($articleId: ID!, $input: ArticleInput!) {
        updateArticle(articleId: $articleId, input: $input) {
            _id
            title
            content
            topic {
                title
            }
        }
    }
`;

export const DELETE_ARTICLE = gql`
    mutation DeleteArticle($articleId: ID!) {
        deleteArticle(articleId: $articleId) {
            _id
            title
        }
    }
`;
