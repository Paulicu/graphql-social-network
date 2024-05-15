import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { DELETE_WORKOUT } from '../../graphql/mutations/workout';
import { FaTrash } from 'react-icons/fa';

function DeleteWorkoutButton({ workoutId }) {
    const redirect = useNavigate();

    const [deleteWorkout] = useMutation(DELETE_WORKOUT, {
        variables: { workoutId },
        refetchQueries: ["GetWorkouts"],
        onCompleted: () => redirect("/workouts")
    });

    const handleDelete = async () => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this workout?");
            if (confirmDelete) {   
                await deleteWorkout();
            }
        }
        catch (err) {
            console.error("Error deleting Workout:", err);
        }
    }

    return (
        <button onClick={ handleDelete } className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-400">
            <FaTrash className="mr-2"/> Delete Workout
        </button>
    );
}

export default DeleteWorkoutButton;