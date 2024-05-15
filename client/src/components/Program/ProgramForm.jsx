import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { CREATE_PROGRAM } from '../../graphql/mutations/program';
import { GET_WORKOUTS } from '../../graphql/queries/workout';

function ProgramForm() {
    const [programData, setProgramData] = useState({
        title: "",
        goal: "",
        days: [{ workoutId: null }]
    });

    const redirect = useNavigate();
    const { data: workoutsData, loading: workoutsLoading } = useQuery(GET_WORKOUTS);
    const [createProgram, { loading, error }] = useMutation(CREATE_PROGRAM, {
        variables: {
            input: programData
        },
        onCompleted: (mutation) => {
            redirect(`/program/${ mutation.createProgram._id }`);
        },
        onError: (error) => {
            console.error("Error creating program: ", error);
        }
    });

    const handleInputChange = (e) => {
        setProgramData({ ...programData, [e.target.name]: e.target.value });
    };

    const handleDayChange = (index, workoutId) => {
        const updatedDays = programData.days.map((day, idx) => {
            if (idx === index) {
                return { workoutId };
            }
            return day;
        });
        setProgramData({ ...programData, days: updatedDays });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createProgram();
    };

    const addDay = () => {
        if (programData.days.length < 7) {
            setProgramData({ ...programData, days: [...programData.days, { workoutId: null }] });
        }
    };

    const removeDay = (index) => {
        const filteredDays = programData.days.filter((_, i) => i !== index);
        setProgramData({ ...programData, days: filteredDays });
    };

    if (workoutsLoading) return <p>Loading...</p>;

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold mb-4">
                Create Program
            </h2>

            <form onSubmit={ handleSubmit } className="space-y-4">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Title:</label>
                    <input type="text" name="title" value={ programData.title } onChange={ handleInputChange } className="border border-gray-300 px-3 py-2 rounded-md w-full" />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Goal:
                    </label>

                    <select name="goal" value={ programData.goal } onChange={ handleInputChange } className="border border-gray-300 px-3 py-2 rounded-md w-full">
                        <option value="">Select a Goal ...</option>
                        <option value="Muscle Gain">Muscle Gain</option>
                        <option value="Weight Loss">Weight Loss</option>
                        <option value="Strength Gain">Strength Gain</option>
                    </select>
                </div>

                { programData.days.map((day, index) => (
                    <div key={index} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Day {index + 1}:
                        </label>

                        <select value={ day.workoutId || '' } onChange={ (e) => handleDayChange(index, e.target.value) } className="border border-gray-300 px-3 py-2 rounded-md w-full">
                            <option value="">Rest Day</option>
                            { workoutsData.workouts.map(workout => (
                                <option key={workout._id} value={workout._id}>{workout.title}</option>))
                            }
                        </select>

                        <button type="button" onClick={() => removeDay(index)} className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-400">
                            <FaMinus className="mr-2"/> Remove Day
                        </button>
                    </div>))
                }

                <div className="flex justify-between">
                    <button type="button" onClick={ addDay } disabled={ programData.days.length >= 7 } className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center">
                        <FaPlus className="mr-2"/> Add Day
                    </button>

                    <button type="submit" disabled={ loading } className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                        Create Program
                    </button>
                </div>

                { error && <p className="text-red-500">{ error.message }</p> }
            </form>
        </div>
    );
}

export default ProgramForm;