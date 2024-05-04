import { Link } from 'react-router-dom';

import AverageRating from '../Rating/AverageRating';

function ProgramRow({ program }) {

    return (

        <li className="py-3 sm:py-4" >
            <div className="flex items-center space-x-4">
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                        { program.title }
                    </p>

                    <p className="truncate text-sm">
                        { program.goal }: { program.totalWorkouts } workouts in this program
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between text-base text-gray-900 mt-2">
                <p>{ program.totalRatings } ratings</p>
                
                <p>Average Rating: { program.averageRating }</p>

                <AverageRating averageRating={ program.averageRating } />
            </div>

            <Link to={ `/program/${ program._id }` } className="text-black hover:underline">
                Start Program
            </Link>
        </li>
    );
}

export default ProgramRow;