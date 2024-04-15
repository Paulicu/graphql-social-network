import { useQuery } from '@apollo/client';
import { GET_WORKOUTS } from '../../graphql/queries/workout';
import WorkoutCard from './WorkoutCard';

function WorkoutList() {

    const { loading, error, data } = useQuery(GET_WORKOUTS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    return (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-3 my-3">
            { data.workouts.map((workout) => (<WorkoutCard key={ workout._id } workout={ workout } />)) }
        </div>
    );
}

export default WorkoutList;
