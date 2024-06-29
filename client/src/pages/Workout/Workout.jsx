import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useAuth } from '../../utils/context';
import { GET_WORKOUT } from '../../graphql/queries/workout';
import { FaArrowLeft } from 'react-icons/fa';
import DeleteWorkoutButton from '../../components/Workout/DeleteWorkoutButton';
import ExerciseDetails from '../../components/Exercise/ExerciseDetails';
import WorkoutImage from '../../components/Workout/WorkoutImage';
import UpdateWorkoutInfo from '../../components/Workout/UpdateWorkoutInfo';
import RemoveExerciseButton from '../../components/Exercise/RemoveExerciseButton';

function Workout() {

    const currentUser = useAuth();
    const { workoutId } = useParams();

    const { loading, error, data } = useQuery(GET_WORKOUT, { variables: { workoutId } });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    const workout = data.workout;
    const isAuthor = currentUser && workout.author._id === currentUser._id;
    const isAdmin = currentUser && (currentUser.role === "ADMIN");

    return (

        <div className="bg-gray-100 mx-4 my-4 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
                <button className="flex items-center bg-black text-white px-4 py-2 mr-8 rounded-md hover:bg-gray-800">
                    <Link to="/workouts" className='flex items-center text-white'>
                        <FaArrowLeft className="mr-2" /> Go Back
                    </Link>
                </button>
                { (isAdmin || isAuthor) && (
                    <>
                        <UpdateWorkoutInfo workout={ workout } />
                        <DeleteWorkoutButton workoutId={ workout._id } />
                    </>)
                }
            </div>
           
            <h2 className="text-2xl font-bold mb-4">
                { workout.title }
            </h2>
            
            <div className="flex justify-center">
                <WorkoutImage muscleGroups={ workout.muscleGroups } className="w-1/3 h-1/3"/>
            </div>
           

            <div className="text-gray-600 mb-4">
                <p>
                    <span className="font-semibold">Author:</span> { workout.author.fullName }
                </p>
                <p>
                    <span className="font-semibold">Difficulty:</span> { workout.difficulty }
                </p>
                <p>
                    <span className="font-semibold">Description:</span> { workout.description }
                </p>
            </div>

            <h3 className="text-lg font-bold mb-2">
                Exercises:
            </h3>

            <div className="grid grid-cols-1 gap-4">
                { workout.exercises.map((exercise, index) => (
                    <div key={ index } className="border rounded-lg p-4 bg-white">
                        <p className="font-semibold mb-2">
                            Exercise { index + 1 }:
                        </p>

                        <p className="mb-2">
                            { exercise.sets } sets x { exercise.repetitions } repetitions
                        </p>

                        <ExerciseDetails exercise={ exercise.exercise } />

                        { (isAdmin || isAuthor) && (
                            <RemoveExerciseButton workoutId={ workout._id } exerciseId={ exercise.exercise.id } />)
                        }
                    </div>))
                }
            </div>

            <div className="text-gray-600 mt-4">
                <p>
                    <span className="font-semibold">Created At:</span> { workout.createdAtFormatted }
                </p>
                <p>
                    <span className="font-semibold">Last Updated At:</span> { workout.updatedAtFormatted }
                </p>
            </div>
        </div>
    );
}

export default Workout;