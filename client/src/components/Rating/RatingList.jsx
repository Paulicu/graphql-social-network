import { useQuery } from '@apollo/client';
import { GET_RATINGS_BY_PROGRAM } from '../../graphql/queries/rating';

import RatingCard from './RatingCard';

function RatingList({ programId }) {

    const { loading, error, data } = useQuery(GET_RATINGS_BY_PROGRAM, { variables: { programId } });

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