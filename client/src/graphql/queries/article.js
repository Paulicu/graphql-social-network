import { gql } from '@apollo/client';

export const GET_ARTICLES = gql`
    query GetArticles($sortBy: SortOption, $topicId: ID) {
        articles(sortBy: $sortBy, topicId: $topicId) {
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

export const GET_ARTICLE = gql`
    query GetArticle($id: ID!) {
        article(articleId: $id) {
            _id
            title
            content
            createdAtFormatted
            updatedAtFormatted
            totalComments
            topic {
                _id
                title
                description
                createdAtFormatted
                updatedAtFormatted
                author {
                    fullName
                    profilePicture
                }
            }
            author {
                _id
                fullName
                profilePicture
            }
        }
    }
`;