import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/context';

function ExerciseCard({ exercise, isSelected, onSelect }) {
    const currentUser = useAuth();
    return (
        <div className="border border-gray-200 bg-white rounded-md shadow-md p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">
                { exercise.name }
            </h2>

            <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500">
                    Equipment: { exercise.equipment }
                </p>

                <p className="text-gray-500">
                    Body Part: { exercise.bodyPart }
                </p>

                <p className="text-gray-500">
                    Target Muscle: { exercise.target }
                </p>
            </div>

            <img src={ exercise.gifUrl } alt={ exercise.name } className="w-full h-auto mb-2" />

            <div className="flex items-center justify-between">
                <Link to={ `/exercise/${ exercise.id }` } className="text-black hover:underline">
                    See more
                </Link>

                { currentUser && <input type="checkbox" checked={ isSelected } onChange={ () => onSelect(exercise) } id={ exercise.id } /> }
            </div>
        </div>
    );
}

export default ExerciseCard;