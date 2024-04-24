import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_WORKOUT_INFO } from '../../graphql/mutations/workout';
import { GET_WORKOUT } from '../../graphql/queries/workout';
import { FaEdit } from 'react-icons/fa';

function UpdateWorkoutInfo({ workout }) {

    const [showModal, setShowModal] = useState(false);
    const [workoutData, setWorkoutData] = useState(
    {
        title: workout.title,
        difficulty: workout.difficulty,
        description: workout.description
    });

    const [updateWorkout] = useMutation(UPDATE_WORKOUT_INFO, 
    {
        variables: { workoutId: workout._id, input: workoutData },
        refetchQueries: [{ query: GET_WORKOUT, variables: { workoutId: workout._id } }]
    });

    const toggleModal = () => {

        setShowModal(!showModal);
    };

    const handleChange = (e) => {

        const { name, value } = e.target;
        setWorkoutData({ ...workoutData, [name]: value });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        try {

            await updateWorkout();
            toggleModal();
        } 
        catch (err) {

            console.error("Error updating workout:", err);
        }
    };

    return (
        <>
            <button onClick={ toggleModal } className="flex items-center bg-black text-white px-4 py-2 mr-4 rounded-md hover:bg-gray-800">
                <FaEdit className="mr-2" /> Edit Workout Info
            </button>

            { showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">
                            Edit Workout
                        </h2>

                        <form onSubmit={ handleSubmit } className="space-y-4">
                            <div>
                                <label htmlFor="title" className="text-gray-700 font-medium text-sm block">
                                    Title
                                </label>

                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={ workoutData.title }
                                    onChange={ handleChange }
                                    className="mt-1 p-2 w-full border rounded-md text-black"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="difficulty" className="text-gray-700 font-medium text-sm block">
                                    Difficulty
                                </label>

                                <select id="difficulty" name="difficulty" value={ workoutData.difficulty } onChange={ handleChange } className="mt-1 p-2 w-full border rounded-md text-black" required>
                                    <option value="BEGINNER">Beginner</option>
                                    <option value="INTERMEDIATE">Intermediate</option>
                                    <option value="ADVANCED">Advanced</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="description" className="text-gray-700 font-medium text-sm block">
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    value={ workoutData.description }
                                    onChange={ handleChange }
                                    className="mt-1 p-2 w-full border rounded-md text-black"
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <button type="button" onClick={ toggleModal } className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-400 mr-4">
                                    Cancel
                                </button>

                                <button type="submit" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>)
            }
        </>
    );
}

export default UpdateWorkoutInfo;