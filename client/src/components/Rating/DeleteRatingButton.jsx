import { useMutation } from '@apollo/client';
import { DELETE_RATING } from '../../graphql/mutations/rating';

import { FaTrash } from 'react-icons/fa';

function DeleteRatingButton({ ratingId }) {

    const [deleteRating] = useMutation(DELETE_RATING, 
    { 
        variables: { ratingId }, 
        refetchQueries: ["GetRatingsByProgram", "GetPrograms"] 
    });

    const handleDelete = async () => {

        try {

            await deleteRating();
        }
        catch (err) {
            
            console.error("Error deleting Rating:", err);
        }
    }

    return (
       
        <div>
            <button onClick={ handleDelete } className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-400">
                <FaTrash />
            </button>
        </div>
    );
}

export default DeleteRatingButton;