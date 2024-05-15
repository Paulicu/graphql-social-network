import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { FaEdit } from 'react-icons/fa';
import { UPDATE_COMMENT } from '../../graphql/mutations/comment';
import { GET_COMMENTS_BY_ARTICLE } from '../../graphql/queries/comment';

function UpdateCommentModal({ comment, articleId }) {
    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState(comment.content);

    const [updateComment, { loading, error }] = useMutation(UPDATE_COMMENT, { 
        variables: { commentId: comment._id, input: { content } },
        refetchQueries: [{ query: GET_COMMENTS_BY_ARTICLE, variables: { articleId: articleId } }] 
    });

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleChange = (e) => {
        setContent(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateComment();
            toggleModal();
        } 
        catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <button onClick={ toggleModal } className="flex items-center bg-black text-white px-4 py-2 mr-2 rounded-md hover:bg-gray-800">
                <FaEdit />
            </button>
            
            { showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">
                            Edit your comment
                        </h2>

                        <form onSubmit={ handleSubmit } className="space-y-4">
                            <div>
                                <label htmlFor="content" className="text-gray-700 font-medium text-sm block">
                                    Content
                                </label>

                                <textarea 
                                    id="content" 
                                    className="mt-1 p-2 w-full border rounded-md text-black" 
                                    name="content" 
                                    value={ content } 
                                    onChange={ handleChange } 
                                />
                            </div>
                            { error && <p className="text-red-500 mt-2 text-center font-medium">{ error.message }</p> }
                            <div className="flex justify-end">
                                <button type="button" className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-400 mr-4" onClick={ toggleModal }>
                                    Cancel
                                </button>

                                <button type="submit" disabled={ loading } className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                                    { loading ? "Saving..." : "Save" }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>)
            }
        </>
    );
} 

export default UpdateCommentModal;