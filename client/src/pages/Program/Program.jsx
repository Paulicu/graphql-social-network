import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PROGRAM } from '../../graphql/queries/program';
import { FaArrowLeft } from 'react-icons/fa';
import AddRatingForm from '../../components/Rating/AddRatingForm';
import RatingList from '../../components/Rating/RatingList';
import DeleteProgramButton from '../../components/Program/DeleteProgramButton';
import { useAuth } from '../../utils/context';
import UpdateProgramForm from '../../components/Program/UpdateProgramForm';

function Program() {
    
    const currentUser = useAuth();
    const { programId } = useParams();
    const { loading, data, error } = useQuery(GET_PROGRAM, { variables: { programId } });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    const program = data.program;
    const isAuthor = currentUser && program.author._id === currentUser._id;
    const isAdmin = currentUser && (currentUser.role === "ADMIN");

    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
                <button className="flex items-center bg-black text-white px-4 py-2 mr-8 rounded-md hover:bg-gray-800">
                    <Link to="/programs" className='flex items-center text-white'>
                        <FaArrowLeft className="mr-2" /> Go Back
                    </Link>
                </button>
                { (isAdmin || isAuthor) && <DeleteProgramButton programId={ program._id } /> }
            </div>
           
            <div className="text-lg font-semibold text-gray-700 mb-2">
                {program.title}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p><strong>Goal:</strong> {program.goal}</p>
                    <p><strong>Created At:</strong> {program.createdAtFormatted}</p>
                    <p><strong>Last Updated:</strong> {program.updatedAtFormatted}</p>
                    <p><strong>Total Workouts:</strong> {program.totalWorkouts}</p>
                    <p><strong>Total Ratings:</strong> {program.totalRatings}</p>
                    <p><strong>Average Rating:</strong> {program.averageRating.toFixed(1)}</p>
                    <p><strong>Author:</strong> {program.author.fullName}</p>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-700">Program Details</h2>
                    <ul className="list-disc pl-5">
                        {program.days.map((day) => (
                            <li key={day.dayNumber}>
                                <strong>Day {day.dayNumber}:</strong> {day.isRestDay ? 'Rest Day' : 'Workout Day'}
                                {day.workout && (
                                    <div className="ml-4">
                                        <h3 className="font-semibold">{day.workout.title}</h3>
                                        <p>Difficulty: {day.workout.difficulty}</p>
                                        <ul className="list-disc pl-5">
                                            {day.workout.exercises.map((exercise, index) => (
                                                <li key={index}>
                                                    {exercise.exercise.name} - Sets: {exercise.sets}, Repetitions: {exercise.repetitions}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            { (isAdmin || isAuthor) && <UpdateProgramForm program={program} /> }
            { currentUser && <AddRatingForm programId={ program._id } /> }
            <RatingList programId={ program._id }/>
        </div>
    );
}

export default Program;