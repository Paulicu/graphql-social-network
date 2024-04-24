import { useState } from 'react';
import { useAuth } from '../../utils/context';
import ExerciseList from '../../components/Exercise/ExerciseList';
import WorkoutForm from '../../components/Workout/WorkoutForm';

function Exercises() {

    const currentUser = useAuth();
    const [selectedExercises, setSelectedExercises] = useState([]);

    const handleSelectExercise = (exercise) => {

        setSelectedExercises((currentSelectedExercises) =>
            currentSelectedExercises.includes(exercise) ? currentSelectedExercises.filter((ex) => ex.id !== exercise.id) : [...currentSelectedExercises, exercise]
        );
    };

    return (

        <div className="flex">
            <div className="flex-grow mr-4 mt-4">
                <ExerciseList selectedExercises={ selectedExercises } onSelectExercise={ handleSelectExercise } />
            </div>

            <div className="w-1/3 mr-4 ml-4 mt-4">
                { currentUser && (<WorkoutForm selectedExercises={ selectedExercises } setSelectedExercises={ setSelectedExercises } />) }
            </div>
        </div>
    );
}

export default Exercises;