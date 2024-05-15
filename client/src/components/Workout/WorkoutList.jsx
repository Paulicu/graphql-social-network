import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_WORKOUTS } from '../../graphql/queries/workout';
import { NEW_WORKOUT_SUBSCRIPTION } from '../../graphql/subscriptions/workout';
import WorkoutCard from './WorkoutCard';

function WorkoutList() {
    const { loading, error, data, subscribeToMore } = useQuery(GET_WORKOUTS);

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: NEW_WORKOUT_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                    return prev;
                }
                const newWorkout = subscriptionData.data.newWorkoutSubscription;
                return { workouts: [newWorkout, ...prev.workouts] };
            },
        });
    
        return () => unsubscribe();
    }, [subscribeToMore]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    return (
        <>
            { !loading && !error && data.workouts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-3 my-3">
                    { data.workouts.map((workout) => (<WorkoutCard key={ workout._id } workout={ workout } />)) }
                </div>) : (<p>No Workouts added yet...</p>)
            }
        </>
    );
}

export default WorkoutList;