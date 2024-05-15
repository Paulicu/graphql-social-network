import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_ARTICLE } from '../../graphql/mutations/article';
import { GET_ARTICLE } from '../../graphql/queries/article';
import { GET_TOPICS } from '../../graphql/queries/topic';
import { FaEdit } from 'react-icons/fa';

function UpdateArticleModal({ article }) {
    const [showModal, setShowModal] = useState(false);
    const [articleData, setArticleData] = useState({ 
        title: article.title, 
        content: article.content, 
        topic: article.topic.title 
    });

    const { data: topicsData } = useQuery(GET_TOPICS);

    const [updateArticle, { loading, error }] = useMutation(UPDATE_ARTICLE, { 
        variables: { articleId: article._id, input: articleData },
        refetchQueries: [
            { query: GET_ARTICLE, variables: { articleId: article._id } },
            { query: GET_TOPICS }
        ] 
    });

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setArticleData({ ...articleData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateArticle();
            toggleModal();
        } 
        catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <button onClick={ toggleModal } className="flex items-center bg-black text-white px-4 py-2 mr-4 rounded-md hover:bg-gray-800">
                <FaEdit className="mr-2" /> Edit Article
            </button>

            { showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">
                            Edit Article
                        </h2>

                        <form onSubmit={ handleSubmit } className="space-y-4">
                            <div>
                                <label htmlFor="title" className="text-gray-700 font-medium text-sm block">
                                    Title
                                </label>

                                <input
                                    id="title"
                                    className="mt-1 p-2 w-full border rounded-md text-black"
                                    type="text"
                                    name="title"
                                    value={ articleData.title }
                                    onChange={ handleChange }
                                />
                            </div>

                            <div>
                                <label htmlFor="content" className="text-gray-700 font-medium text-sm block">
                                    Content
                                </label>

                                <textarea
                                    id="content"
                                    className="mt-1 p-2 w-full border rounded-md text-black"
                                    name="content"
                                    value={ articleData.content }
                                    onChange={ handleChange }
                                />
                            </div>

                            <div>
                                <label htmlFor="topic" className="text-gray-700 font-medium text-sm block">
                                    Topic
                                </label>

                                <select id="topic" name="topic" value={ articleData.topic } onChange={ handleChange } className="mt-1 p-2 w-full border rounded-md text-black">
                                    <option value="">Select a topic</option>

                                    { topicsData.topics.map((topic) => (
                                        <option key={ topic._id } value={ topic.title }>
                                            { topic.title }
                                        </option>
                                    ))}
                                </select>
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

export default UpdateArticleModal;