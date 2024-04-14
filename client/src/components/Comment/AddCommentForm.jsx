import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_COMMENT } from '../../graphql/mutations/comment';

function AddCommentForm({ articleId }) {

    const [content, setContent] = useState("");
    const [addComment] = useMutation(ADD_COMMENT, 
    {
        variables: { articleId, input: { content } },
        refetchQueries: ["GetCommentsByArticle", "GetArticles", "GetArticle"],
    });

    const handleSubmit = async () => {

        try {

            await addComment();
            setContent("");
        } 
        catch (err) {

            console.error("Error adding comment:", err);
        }
    };

    const handleChange = (e) => {
        
        setContent(e.target.value);
    };

    return (

        <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">
                Add Comment
            </h2>

            <textarea
                value={ content }
                onChange={ handleChange }
                rows={ 4 }
                placeholder="Add your comment..."
                className="w-full p-2 border rounded"
            />

            <button onClick={ handleSubmit } className="mt-2 bg-black text-white py-2 px-4 rounded">
                Add Comment
            </button>
        </div>
    );
}

export default AddCommentForm;
