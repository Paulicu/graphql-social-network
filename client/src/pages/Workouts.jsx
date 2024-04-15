import WorkoutList from '../components/Workout/WorkoutList';

function Workouts() {
  
    return (
    
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-semibold mb-4">
                Workouts
            </h1>
            
            <div className="max-w-3xl">
                <WorkoutList />
            </div>
        </div>
    );
}

export default Workouts;
