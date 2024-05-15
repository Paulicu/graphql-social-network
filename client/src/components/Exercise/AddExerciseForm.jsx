import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_WORKOUTS_BY_AUTHOR } from '../../graphql/queries/workout';
import { ADD_EXERCISE_TO_WORKOUT } from '../../graphql/mutations/workout';
import { GET_WORKOUT } from '../../graphql/queries/workout';
import { useAuth } from '../../utils/context';
import { useNavigate } from 'react-router-dom';

function AddExerciseForm({ exerciseId }) {
    const currentUser = useAuth();
    const redirect = useNavigate();
    const [workoutId, setWorkoutId] = useState("");
    const [sets, setSets] = useState("");
    const [repetitions, setRepetitions] = useState("");

    const { data, loading, error } = useQuery(GET_WORKOUTS_BY_AUTHOR, { variables: { authorId: currentUser._id } });

    const [addExerciseToWorkout, { loading: mutationLoading, error: mutationError }] = useMutation(ADD_EXERCISE_TO_WORKOUT, {
        variables: { workoutId, input: { exerciseId, sets: parseInt(sets), repetitions: parseInt(repetitions) } },
        refetchQueries: [{ query: GET_WORKOUT, variables: { workoutId } }],
        onCompleted: () => redirect(`/workout/${ workoutId }`)
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addExerciseToWorkout();
        } 
        catch (err) {
            console.error("Error adding exercise: ", err);
        }
    };

    return (
        <div className="mt-6 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-lg font-semibold mb-4">
                Add Exercise to Workout
            </h2>

            <form onSubmit={ handleSubmit } className="space-y-4">
                <div className="mb-4">
                    <label htmlFor="workout" className="block mb-2">
                        Workout:
                    </label>

                    <select id="workout" value={ workoutId } onChange={ (e) => setWorkoutId(e.target.value) } className="border rounded-md px-2 py-1 w-full">
                        <option value="">Select a Workout ...</option>

                        { data.workoutsByAuthor.map((workout) => (
                            <option key={ workout._id } value={ workout._id }>
                                { workout.title }
                            </option>))
                        }
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="sets" className="block mb-2">
                        Sets:
                    </label>

                    <input
                        type="text"
                        id="sets"
                        value={ sets }
                        onChange={ (e) => setSets(e.target.value) }
                        className="border rounded-md px-2 py-1 w-full"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="repetitions" className="block mb-2">
                        Repetitions:
                    </label>

                    <input
                        type="text"
                        id="repetitions"
                        value={ repetitions }
                        onChange={ (e) => setRepetitions(e.target.value) }
                        className="border rounded-md px-2 py-1 w-full"
                    />
                </div>

                <button type="submit" disabled={ mutationLoading } className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                    { mutationLoading ? "Adding..." : "Add Exercise" }
                </button>

                { mutationError && <p className="text-red-500">Error: { mutationError.message }</p> }
            </form>
        </div>
    );
}

export default AddExerciseForm;