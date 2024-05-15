import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RATINGS_BY_PROGRAM } from '../../graphql/queries/rating';
import { NEW_RATING_SUBSCRIPTION } from '../../graphql/subscriptions/rating';
import RatingCard from './RatingCard';

function RatingList({ programId }) {
    const { loading, error, data, subscribeToMore } = useQuery(GET_RATINGS_BY_PROGRAM, { variables: { programId } });

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: NEW_RATING_SUBSCRIPTION,
            variables: { programId },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                    return prev;
                }

                const newRating = subscriptionData.data.newRatingSubscription;
                return {
                    ...prev,
                    ratingsByProgram: [newRating, ...prev.ratingsByProgram]
                };
            }
        });
        return () => unsubscribe();
    }, [programId, subscribeToMore]);

    if (loading) return <p>Loading ratings...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    const ratings = data.ratingsByProgram;

    return (
        <>
            { !loading && !error && (ratings.length > 0 ? (
                <div>
                    { ratings.map((rating) => (<RatingCard key={ rating._id } rating={ rating } />)) }
                </div>) : (<p>No ratings added yet...</p>))
            }
        </>
    );
}

export default RatingList;