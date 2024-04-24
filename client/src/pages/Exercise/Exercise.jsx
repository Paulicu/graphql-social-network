import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_EXERCISE_BY_ID } from '../../graphql/queries/exercise';
import { useAuth } from '../../utils/context';

import ExerciseDetails from '../../components/Exercise/ExerciseDetails';
import AddExerciseForm from '../../components/Exercise/AddExerciseForm';


function Exercise() {

    const currentUser = useAuth();
    const { exerciseId } = useParams();

    const { loading, error, data } = useQuery(GET_EXERCISE_BY_ID, { variables: { exerciseId } });
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    const exercise = data.exerciseById;

    return (

        <div className="flex">
            <div className="flex-grow mr-4 mt-4">
                <ExerciseDetails exercise={ exercise } />
            </div>
            
            <div className="w-1/3 mr-4 ml-4 mt-4">
                { currentUser && (<AddExerciseForm exerciseId={ exercise.id } />) }
            </div>
        </div>
    );
}

export default Exercise;