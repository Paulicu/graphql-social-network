import { useQuery } from '@apollo/client';
import { GET_COMMENTS_BY_ARTICLE } from '../../graphql/queries/comment';

import CommentCard from './CommentCard';

function CommentList({ articleId, currentUser }) {

    const { loading, error, data } = useQuery(GET_COMMENTS_BY_ARTICLE, { variables: { articleId } });

    if (loading) return <p>Loading comments...</p>;
    if (error) return <p>Error fetching comments: {error.message}</p>;

    const comments = data.commentsByArticle;

    return (
        
        <>
            { !loading && !error && (comments.length > 0 ? (
                <div>
                    { comments.map((comment) => (<CommentCard key={ comment._id } comment={ comment } currentUser={ currentUser }/>)) }
                </div>) : (<p>No comments added yet...</p>))
            }
        </>
    );
}

export default CommentList;