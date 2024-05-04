import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_PROGRAM } from '../../graphql/mutations/program';
import { GET_WORKOUTS } from '../../graphql/queries/workout';
import { GET_PROGRAM } from '../../graphql/queries/program';

function UpdateProgramForm({ program }) {

    const [programData, setProgramData] = useState(
    {
        title: program.title,
        goal: program.goal,
        days: program.days.map(day => ({ workoutId: day.workout ? day.workout._id : "" }))
    });

    const { data: workoutsData, loading: loadingWorkouts } = useQuery(GET_WORKOUTS);

    const [updateProgram, { loading, error }] = useMutation(UPDATE_PROGRAM, 
    {
        variables: { programId: program._id, input: programData },
        refetchQueries: [ { query: GET_PROGRAM, variables: { programId: program._id } }] 
    });

    const handleChange = (e) => {
        setProgramData({ ...programData, [e.target.name]: e.target.value });
    };

    const handleDayChange = (index, workoutId) => {
        const updatedDays = programData.days.map((day, i) => {
            if (i === index) {
                return {
                    ...day,
                    workoutId: workoutId
                };
            }
            return day;
        });
        setProgramData({ ...programData, days: updatedDays });
    };

    const handleAddDay = () => {
        setProgramData({ ...programData, days: [...programData.days, { workoutId: "" }] });
    };

    const handleRemoveDay = (index) => {
        const filteredDays = programData.days.filter((_, i) => i !== index);
        setProgramData({ ...programData, days: filteredDays });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProgram();
    };

    if (loadingWorkouts) return <p>Loading workouts...</p>;

    return (
        <form onSubmit={ handleSubmit } className="space-y-4">
            <div>
                <label>Title:</label>
                <input type="text" name="title" value={programData.title} onChange={ handleChange } required />
            </div>

            <div>
                <label>Goal:</label>
                <select name="goal" value={ programData.goal } onChange={ handleChange } required>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Strength Training">Strength Training</option>
                    <option value="Endurance">Endurance</option>
                </select>
            </div>

            { programData.days.map((day, index) => (
                <div key={index} className="flex items-center space-x-3">
                    <label>Day {index + 1}:</label>
                    <select value={day.workoutId || ''} onChange={(e) => handleDayChange(index, e.target.value)} className="flex-1">
                        <option value="">Rest Day</option>
                        { workoutsData && workoutsData.workouts.map(workout => (
                            <option key={workout._id} value={workout._id}>{workout.title}</option>))
                        }
                    </select>

                    <button type="button" onClick={() => handleRemoveDay(index)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">
                        Remove
                    </button>
                </div>))
            }

            <div className="flex justify-between">
                <button type="button" onClick={ handleAddDay } disabled={programData.days.length >= 7} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Add Day
                </button>

                <button type="submit" disabled={ loading } className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                    Update Program
                </button>
            </div>

            { error && <p className="text-red-500">{ error.message }</p> }
        </form>
    );
}

export default UpdateProgramForm;