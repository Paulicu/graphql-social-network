import { useMutation } from "@apollo/client";
import { REMOVE_EXERCISE_FROM_WORKOUT } from "../../graphql/mutations/workout";
import { GET_WORKOUT } from "../../graphql/queries/workout";
import { FaTrash } from "react-icons/fa";

function RemoveExerciseButton({ workoutId, exerciseId }) {

    const [removeExerciseFromWorkout, { loading, error }] = useMutation(REMOVE_EXERCISE_FROM_WORKOUT, 
    {
        variables: { workoutId: workoutId, exerciseId: exerciseId }, 
        refetchQueries: [{ query: GET_WORKOUT, variables: { workoutId } }]
    });

    const handleRemove = async () => {

        try {

            await removeExerciseFromWorkout(); 
        } 
        catch (err) {

            console.error("Execution error in handleRemove:", err);
        }
    };

    if (loading) return <p>Removing...</p>;
    if (error) return <p>Error removing exercise: {error.message}</p>;

    return (
        
        <button onClick={ handleRemove } className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-400">
            <FaTrash className="mr-2"/> Remove from Workout
        </button>
    );
}

export default RemoveExerciseButton;