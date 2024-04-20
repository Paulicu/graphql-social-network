import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_EXERCISE_BY_ID } from '../graphql/queries/exercise';

import ExerciseDetails from '../components/Exercise/ExerciseDetails';

function Exercise() {

    const { exerciseId } = useParams();

    const { loading, error, data } = useQuery(GET_EXERCISE_BY_ID, { variables: { exerciseId } });
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    const exercise = data.exerciseById;

    return (
        
        <ExerciseDetails exercise={ exercise } />
    );
}

export default Exercise;