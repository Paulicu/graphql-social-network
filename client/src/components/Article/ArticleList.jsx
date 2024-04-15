import { useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ARTICLES } from '../../graphql/queries/article';
import { NEW_ARTICLE_SUBSCRIPTION } from '../../graphql/subscriptions/article';
import ArticleCard from './ArticleCard';

function ArticleList({ sortBy, selectedTopicId }) {

    const { loading, error, data, subscribeToMore } = useQuery(GET_ARTICLES, { variables: { sortBy, topicId: selectedTopicId } });

    const subscribeToNewArticles = useCallback(() => {

		return subscribeToMore({

			document: NEW_ARTICLE_SUBSCRIPTION,
			updateQuery: (prev, { subscriptionData }) => {

				if (!subscriptionData.data) return prev;

				const newArticle = subscriptionData.data.newArticleSubscription;
				return { articles: [newArticle, ...prev.articles] };
			},
		});
	}, [subscribeToMore]);
	
	useEffect(() => {
		
		const unsubscribe = subscribeToNewArticles();
		return () => unsubscribe();
	}, [subscribeToNewArticles]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching articles: { error.message }</p>;

    return (
        
        <>
            { !loading && !error && (data.articles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-3 my-3">
                    { data.articles.map((article) => (<ArticleCard key={ article._id } article={ article } />)) }
                </div>) : ( selectedTopicId? (<p>No Articles in this topic yet..</p>) : (<p>No Articles added yet...</p>)))
            }
        </>
    );
}

export default ArticleList;