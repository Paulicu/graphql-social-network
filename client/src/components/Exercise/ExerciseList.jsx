import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_EXERCISES } from '../../graphql/queries/exercise';

import ExerciseCard from './ExerciseCard';
import ExerciseFilters from './ExerciseFilters';

function ExerciseList({ selectedExercises, onSelectExercise }) {
    
    const [selectedFilters, setSelectedFilters] = useState({ equipment: [], bodyParts: [], targets: [] });
    const [offset, setOffset] = useState(0);

    const { loading, error, data, fetchMore, refetch } = useQuery(GET_EXERCISES, {
        variables: { pagination: { offset: offset }, filters: selectedFilters }
    });

    useEffect(() => {
        refetch({ filters: selectedFilters });
    }, [selectedFilters, refetch]);

    const handleLoadMore = () => {
        fetchMore({
            variables: { pagination: { offset: data.exercises.length } },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return {
                    ...prev,
                    exercises: [...prev.exercises, ...fetchMoreResult.exercises]
                };
            }
        });
    };

    const handleFiltersChange = (filterType, value) => {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: prevFilters[filterType].includes(value) ? prevFilters[filterType].filter((filter) => filter !== value) : [...prevFilters[filterType], value]
        }));
        setOffset(0); 
    };
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    const exercises = data.exercises;
    
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
            <div className="flex justify-center mt-6">
                <button onClick={ handleLoadMore } className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                    Load More
                </button>
            </div>
        </div>
    );
}

export default ExerciseList;