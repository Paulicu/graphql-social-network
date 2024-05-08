import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_WORKOUT } from '../../graphql/mutations/workout';

function WorkoutForm({ selectedExercises, setSelectedExercises }) {

    const [createWorkout, { loading, error }] = useMutation(CREATE_WORKOUT);

    const [workoutData, setWorkoutData] = useState({ title: "", description: "", difficulty: "", exercises: [] });

    useEffect(() => {

        setWorkoutData({

            ...workoutData,
            exercises: selectedExercises.map(exercise => {

                const existingExercise = workoutData.exercises.find(ex => ex.exerciseId === exercise.id);
                return existingExercise || { exerciseId: exercise.id, sets: "", repetitions: "" };
            })
        });
        
    }, [selectedExercises]);

    const handleChange = (e) => {

        const { name, value, id } = e.target;

        if (id.startsWith('sets-') || id.startsWith('repetitions-')) {
            
            const exId = id.split('-')[1];
            const exercises = workoutData.exercises.map(exercise => exercise.exerciseId === exId ? { ...exercise, [name]: value } : exercise);
            setWorkoutData({ ...workoutData, exercises: exercises });
        } 
        else {
            
            setWorkoutData({ ...workoutData, [name]: value });
        }
    };

    const handleSubmit = async () => {

        try {
            
            const exercisesData = workoutData.exercises.map(exercise => (
            {
                ...exercise,
                sets: parseInt(exercise.sets),
                repetitions: parseInt(exercise.repetitions),
            }));

            await createWorkout(
            { 
                variables: { input: { ...workoutData, exercises: exercisesData } } 
            });

            setSelectedExercises([]);
            setWorkoutData({ title: "", description: "", difficulty: "", exercises: [] });
        } 
        catch (err) {
            
            console.error("Error creating workout:", err);
        }
    };

    const removeExercise = (id) => {
        const updatedExercises = selectedExercises.filter(exercise => exercise.id !== id);
        setSelectedExercises(updatedExercises);
    };

    return (

        <div className="mt-6 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-lg font-semibold mb-4">Select Exercises for a Workout</h2>

            <div className="mb-4">
                <label className="block mb-2" htmlFor="title">
                    Title:
                </label>
                
                <input
                    id="title"
                    type="text"
                    name="title"
                    value={ workoutData.title }
                    onChange={ handleChange }
                    className="border rounded-md px-2 py-1 w-full"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-2" htmlFor="difficulty">
                    Difficulty:
                </label>

                <select id="difficulty" name="difficulty" value={ workoutData.difficulty } onChange={ handleChange } className="border rounded-md px-2 py-1 w-full">   
                    <option value="">Select a difficulty ...</option>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block mb-2" htmlFor="description">
                    Description:
                </label>

                <textarea
                    id="description"
                    name="description"
                    value={ workoutData.description }
                    onChange={ handleChange }
                    className="border rounded-md px-2 py-1 w-full h-20"
                />
            </div>

            { selectedExercises.length === 0 && <p className="text-gray-500 mb-4">No exercises selected yet...</p> }

            { selectedExercises.map(exercise => (
                <div key={ exercise.id } className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                        { exercise.name }
                    </h3>

                    <div className="flex mb-2">
                        <label htmlFor={ `sets-${ exercise.id }` } className="mr-2">
                            Sets:
                        </label>

                        <input
                            id={ `sets-${ exercise.id }` }
                            name="sets"
                            type="text"
                            value={ workoutData.exercises.find(ex => ex.exerciseId === exercise.id)?.sets || "" }
                            onChange={ handleChange }
                            className="border rounded-md px-2 py-1"
                        />
                    </div>

                    <div className="flex">
                        <label htmlFor={ `repetitions-${ exercise.id }` } className="mr-2">
                            Repetitions:
                        </label>

                        <input
                            id={ `repetitions-${ exercise.id }` }
                            name="repetitions"
                            type="text"
                            value={ workoutData.exercises.find(ex => ex.exerciseId === exercise.id)?.repetitions || "" }
                            onChange={ handleChange }
                            className="border rounded-md px-2 py-1"
                        />
                    </div>

                    <button onClick={() => removeExercise(exercise.id)}>
                        Remove
                    </button>
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