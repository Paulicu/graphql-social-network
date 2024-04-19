import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_EXERCISES } from '../../graphql/queries/exercise';

import ExerciseCard from './ExerciseCard';
import ExerciseFilters from './ExerciseFilters';

function ExerciseList({ selectedExercises, onSelectExercise }) {

    const [selectedFilters, setSelectedFilters] = useState({ equipment: [], bodyParts: [], targets: [] });

    const { loading, error, data } = useQuery(GET_EXERCISES, 
    {
        variables: {

            ...(selectedFilters.equipment.length > 0 && { equipment: selectedFilters.equipment }),
            ...(selectedFilters.bodyParts.length > 0 && { bodyParts: selectedFilters.bodyParts }),
            ...(selectedFilters.targets.length > 0 && { targets: selectedFilters.targets }),
        }
    });

    const handleFiltersChange = (filterType, value) => {

        setSelectedFilters((prevFilters) => (
        {
            ...prevFilters,
            [filterType]: prevFilters[filterType].includes(value) ? prevFilters[filterType].filter((filter) => filter !== value) : [...prevFilters[filterType], value],
        }));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    const exercises = data?.exercises;

    return (

        <div>
            <ExerciseFilters selectedFilters={ selectedFilters } onChange={ handleFiltersChange } />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-3 my-3">
                { exercises.map((exercise) => (
                    <ExerciseCard
                        key={ exercise.id }
                        exercise={ exercise }
                        isSelected={ selectedExercises.some((selected) => selected.id === exercise.id) }
                        onSelect={ onSelectExercise }
                    />))
                }
            </div>
        </div>
    );
}

export default ExerciseList;
