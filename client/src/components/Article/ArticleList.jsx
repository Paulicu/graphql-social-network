import { useQuery } from '@apollo/client';
import { GET_ARTICLES } from '../../graphql/queries/article';

import ArticleCard from './ArticleCard';

function ArticleList({ sortBy, selectedTopicId }) {

    const { loading, error, data } = useQuery(GET_ARTICLES, { variables: { sortBy, topicId: selectedTopicId } });

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