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
            totalViews
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