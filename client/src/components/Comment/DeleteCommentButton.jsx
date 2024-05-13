import { useMutation } from '@apollo/client';
import { DELETE_COMMENT } from '../../graphql/mutations/comment';
import { GET_ARTICLES } from '../../graphql/queries/article';
import { FaTrash } from 'react-icons/fa';

function DeleteCommentButton({ commentId }) {

    const [deleteComment] = useMutation(DELETE_COMMENT, { 

        variables: { commentId }, 
        refetchQueries: ["GetCommentsByArticle", { query: GET_ARTICLES }] 
    });

    const handleDelete = async () => {

        try {

            await deleteComment();
        }
        catch (err) {
            
            console.error("Error DELETING Comment:", err);
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

export default DeleteCommentButton;