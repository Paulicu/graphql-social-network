import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_WORKOUT } from '../../graphql/mutations/workout';

function WorkoutForm({ selectedExercises, setSelectedExercises }) {

    const [createWorkout, { loading, error }] = useMutation(CREATE_WORKOUT);
    
    const [workoutData, setWorkoutData] = useState({});

    useEffect(() => {

        setWorkoutData({});
    }, [selectedExercises]);

    const handleChange = (exerciseId, field, value) => {

        setWorkoutData((prevData) => ({

            ...prevData,
            [exerciseId]: {

                ...prevData[exerciseId],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async () => {

        const exercisesInput = selectedExercises.map((exercise) => ({

            exerciseId: exercise.id,
            sets: parseInt(workoutData[exercise.id]?.sets) || 0,
            repetitions: parseInt(workoutData[exercise.id]?.repetitions) || 0,
        }));

        try {

            await createWorkout({ variables: { exercises: exercisesInput } });
            setSelectedExercises([]);
        } 
        catch (err) {

            console.error("Error creating workout:", err);
        }
    };

    return (

        <div className="mt-6 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-lg font-semibold mb-4">
                Select Exercises for a Workout
            </h2>

            { selectedExercises.length === 0 && (<p className="text-gray-500 mb-4">No exercises selected yet...</p>) }

            { selectedExercises.map((exercise) => (
                <div key={ exercise.id } className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                        { exercise.name }
                    </h3>

                    <div className="flex mb-2">
                        <label className="mr-2">
                            Sets:
                        </label>

                        <input
                            type="text"
                            value={ workoutData[exercise.id]?.sets || "" }
                            onChange={ (e) => handleChange(exercise.id, "sets", e.target.value) }
                            className="border rounded-md px-2 py-1"
                        />
                    </div>

                    <div className="flex">
                        <label className="mr-2">
                            Repetitions:
                        </label>

                        <input
                            type="text"
                            value={ workoutData[exercise.id]?.repetitions || "" }
                            onChange={ (e) => handleChange(exercise.id, "repetitions", e.target.value) }
                            className="border rounded-md px-2 py-1"
                        />
                    </div>
                </div>))
            }

            <button onClick={ handleSubmit } disabled={ loading } className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                { loading ? "Creating Workout..." : "Create Workout" }
            </button>

            { error && <p className="text-red-500">Error creating workout: { error.message }</p> } 
        </div>
    );
}

export default WorkoutForm;
