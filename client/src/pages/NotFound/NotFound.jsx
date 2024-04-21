import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

function NotFound() {

    return (
        
        <div className="flex items-center justify-center h-screen flex-col space-y-4 text-center">
            <FaExclamationTriangle className="text-4xl text-yellow-500 w-40 h-40" />

            <h1 className="text-4xl font-bold">
                404
            </h1>

            <p className="text-lg">
                Sorry, this page does not exist.
            </p>

            <button className="bg-black py-2 px-4 rounded-md hover:bg-gray-800">
                <Link to="/" className="text-white font-medium">
                    Go back home
                </Link>
            </button>
        </div>
    );
}

export default NotFound;