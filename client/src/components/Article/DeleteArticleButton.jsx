import { useMutation } from '@apollo/client';
import { DELETE_ARTICLE } from '../../graphql/mutations/article';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

function DeleteArticleButton({ articleId }) {
    const redirect = useNavigate();

    const [deleteArticle] = useMutation(DELETE_ARTICLE, { 
        variables: { articleId }, 
        onCompleted: () => redirect("/articles"), 
        refetchQueries: ["GetArticles", "GetTopics"] 
    });

    const handleDelete = async () => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this article?");
            if (confirmDelete) {   
                await deleteArticle();
            }
        }
        catch (err) {
            console.error("Error DELETING Article:", err);
        }
    }

    return (
        <button onClick={ handleDelete } className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-400">
            <FaTrash className="mr-2"/> Delete Article
        </button>
    );
}

export default DeleteArticleButton;