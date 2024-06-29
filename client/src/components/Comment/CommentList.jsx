import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_COMMENTS_BY_ARTICLE } from '../../graphql/queries/comment';
import { NEW_COMMENT_SUBSCRIPTION } from '../../graphql/subscriptions/comment';

import CommentCard from './CommentCard';

function CommentList({ articleId }) {
    const { loading, error, data, subscribeToMore } = useQuery(GET_COMMENTS_BY_ARTICLE, { variables: { articleId } });

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: NEW_COMMENT_SUBSCRIPTION,
            variables: { articleId },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                    return prev;
                }
                const newComment = subscriptionData.data.newCommentSubscription;
                return {
                    ...prev,
                    commentsByArticle: [newComment, ...prev.commentsByArticle]
                };
            }
        });
        return () => unsubscribe();
    }, [articleId, subscribeToMore]);

    if (loading) return <p>Loading comments...</p>;
    if (error) return <p>Error fetching comments: { error.message }</p>;

    const comments = data.commentsByArticle;

    return (
        <>
            { !loading && !error && (comments.length > 0 ? (
                <div>
                    { comments.map((comment) => (<CommentCard key={ comment._id } comment={ comment } />)) }
                </div>) : (<p>No comments added yet...</p>))
            }
        </>
    );
}

export default CommentList;