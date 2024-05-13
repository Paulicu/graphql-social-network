import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_ARTICLE } from '../../graphql/mutations/article';
import { GET_TOPICS } from '../../graphql/queries/topic';

function AddArticleModal() {

    const [showModal, setShowModal] = useState(false);
    const [articleData, setArticleData] = useState({ title: "", content: "", topic: "" });
    const redirect = useNavigate();
    const { data } = useQuery(GET_TOPICS);
    
    const [createArticle, { loading, error }] = useMutation(CREATE_ARTICLE, 
    { 
        variables: { input: articleData },
        onCompleted: (mutation) => {
            redirect(`/article/${ mutation.createArticle._id }`);
        },
        refetchQueries: ["GetTopics"] 
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

            await createArticle();
            setArticleData({ title: "", content: "", topic: "" });
            toggleModal();
        } 
        catch (err) {

            console.error(err);
        }
    };

    return (
        <>
            <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 mr-4 flex items-center" onClick={ toggleModal }>
                <FaPlus className="mr-2"/> Create Article
            </button>

            { showModal && (
                <div className="fixed inset-0 z-20 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">
                            Create Article
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
                                    className="mt-1 p-2 w-full border rounded-md text-black md:w-96 h-40"
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
                                    <option value="">Select a topic ...</option>

                                    { data.topics.map((topic) => (
                                        <option key={ topic._id } value={ topic.title }>
                                            { topic.title }
                                        </option>
                                    ))}
                                </select>
                            </div>
                            { error && <p className="text-red-500 mt-2 text-center font-medium">{ error.message }</p> }
                            <div className="flex justify-end">
                                <button type="button" className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-400 mr-4" onClick={toggleModal}>
                                    Cancel
                                </button>

                                <button type="submit" disabled={ loading } className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                                    { loading ? "Creating..." : "Create" }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>)
            }
        </>
    );
}

export default AddArticleModal;