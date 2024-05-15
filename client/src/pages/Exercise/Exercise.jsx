import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_EXERCISE_BY_ID } from '../../graphql/queries/exercise';
import { useAuth } from '../../utils/context';
import { FaArrowLeft } from 'react-icons/fa';
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
                <button className="flex items-center bg-black text-white px-4 py-2 mr-8 ml-4 rounded-md hover:bg-gray-800">
                    <Link to="/exercises" className='flex items-center text-white'>
                        <FaArrowLeft className="mr-2" /> Go Back
                    </Link>
                </button>
                <ExerciseDetails exercise={ exercise } />
            </div>
            
            <div className="w-1/3 mr-4 ml-4 mt-4">
                { currentUser && (<AddExerciseForm exerciseId={ exercise.id } />) }
            </div>
        </div>
    );
}

export default Exercise;