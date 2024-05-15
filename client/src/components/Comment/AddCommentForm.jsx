import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_COMMENT } from '../../graphql/mutations/comment';
import { GET_ARTICLES, GET_ARTICLE } from '../../graphql/queries/article';

function AddCommentForm({ articleId }) {
    const [content, setContent] = useState("");
    const [addComment, { loading, error }] = useMutation(ADD_COMMENT, {
        variables: { articleId, input: { content } },
        refetchQueries: [
            { query: GET_ARTICLE, variables: { articleId: articleId } },
            { query: GET_ARTICLES }
        ]
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
            { error && <p className="text-red-500 mt-2 text-center font-medium">{ error.message }</p> }
            <button onClick={ handleSubmit } disabled={ loading } className="mt-2 bg-black text-white py-2 px-4 rounded">
                { loading ? "Adding Comment..." : "Add Comment" }
            </button>
        </div>
    );
}

export default AddCommentForm;