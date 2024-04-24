import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PROGRAM } from '../../graphql/queries/program';

import AddRatingForm from '../../components/Rating/AddRatingForm';
import RatingList from '../../components/Rating/RatingList';
import DeleteProgramButton from '../../components/Program/DeleteProgramButton';
import { useAuth } from '../../utils/context';

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

        // To do: Initial data check, update later
        <div>
            { (isAdmin || isAuthor) && (<DeleteProgramButton programId={ program._id } />) }

            <h1>{program.title}</h1>
            <p>Goal: {program.goal}</p>
            <p>Created At: {program.createdAtFormatted}</p>
            <p>Last Updated: {program.updatedAtFormatted}</p>
            <p>Total Workouts: {program.totalWorkouts}</p>
            <p>Total Ratings: {program.totalRatings}</p>
            <p>Average Rating: {program.averageRating}</p>
            <p>Author: {program.author.fullName}</p>

            <h2>Program Details</h2>
            <ul>
                {program.days.map((day) => (
                    <li key={day.dayNumber}>
                        Day {day.dayNumber}: {day.isRestDay ? 'Rest Day' : 'Workout Day'}
                        {day.workout && (
                            <div>
                                <h3>{day.workout.title}</h3>
                                <p>Difficulty: {day.workout.difficulty}</p>
                                <ul>
                                    {day.workout.exercises.map((exercise, index) => (
                                        <li key={index}>
                                            {exercise.exercise.name} - Sets: {exercise.sets}, Repetitions:{' '}
                                            {exercise.repetitions}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <AddRatingForm programId={ program._id } />
            <RatingList programId={ program._id }/>
        </div>
    );
}

export default Program;