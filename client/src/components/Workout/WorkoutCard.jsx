import { Link } from 'react-router-dom';

import WorkoutImage from './WorkoutImage';

function WorkoutCard({ workout }) {

    const { title, difficulty, equipment, totalEquipment, totalExercises, totalMuscleGroups, description, createdAtFormatted, author, muscleGroups } = workout;

    return (

        <div className="border border-gray-200 bg-white rounded-md shadow-md p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">
                { title }
            </h2>

            <p className="text-gray-500 mb-2">
                { description }
            </p>

            <WorkoutImage muscleGroups={ muscleGroups } className="w-full h-auto mb-2" />
            
            <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">Difficulty: { difficulty }</span>
                <span className="text-gray-500">Created on: { createdAtFormatted }</span>
            </div>

            <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">Equipment: { equipment.join(', ') }</span>
                <span className="text-gray-500">Total Equipment: { totalEquipment }</span>
            </div>

            <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">Total Exercises: { totalExercises }</span>
                <span className="text-gray-500">Total Muscle Groups: { totalMuscleGroups }</span>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-gray-500">Author: {author.fullName}</span>
                { author.profilePicture && <img src={ author.profilePicture } alt={ author.fullName } className="w-8 h-8 rounded-full" /> }
            </div>
            
            <Link to={ `/workout/${ workout._id }` } className="text-black hover:underline">
                Read more
            </Link>
        </div>
    );
}

export default WorkoutCard;
