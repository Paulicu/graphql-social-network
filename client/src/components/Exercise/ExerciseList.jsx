import { useQuery } from '@apollo/client';
import { GET_EXERCISES } from '../../graphql/queries/exercise';

import ExerciseCard from './ExerciseCard';

function ExerciseList({ selectedExercises, onSelectExercise }) {
  
    const { loading, error, data } = useQuery(GET_EXERCISES)
        
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    return (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-3 my-3">
            { data.exercises.map((exercise) => (
                <ExerciseCard
                    key={ exercise.id }
                    exercise={ exercise }
                    isSelected={ selectedExercises.some((selected) => selected.id === exercise.id) }
                    onSelect={ onSelectExercise }
                />))
            }
        </div>
    );
}

export default ExerciseList;
