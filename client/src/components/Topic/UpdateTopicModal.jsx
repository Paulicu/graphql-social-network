import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { UPDATE_TOPIC } from '../../graphql/mutations/topic';

function UpdateTopicModal({ topic }) {

    const [showModal, setShowModal] = useState(false);
    const [topicData, setTopicData] = useState({ title: topic.title, description: topic.description });

    const [updateTopic, { loading, error }] = useMutation(UPDATE_TOPIC, { 
        variables: { topicId: topic._id, input: topicData },
        refetchQueries: ["GetTopics", "GetArticles"] 
    });

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTopicData({ ...topicData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateTopic();
            toggleModal();
        } 
        catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 mr-2" onClick={ toggleModal }>
                <FaEdit />
            </button>

            { showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">
                            Update Topic
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
                                    value={ topicData.title } 
                                    onChange={ handleChange }
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="text-gray-700 font-medium text-sm block">
                                    Description
                                </label>

                                <textarea 
                                    id="description" 
                                    className="mt-1 p-2 w-full border rounded-md text-black" 
                                    name="description" 
                                    value={ topicData.description } 
                                    onChange={ handleChange } 
                                />
                            </div>
                            { error && <p className="text-red-500 mt-2 text-center font-medium">{ error.message }</p> }
                            <div className="flex justify-end">
                                <button type="button" onClick={ toggleModal } className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-400 mr-4" >
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

export default UpdateTopicModal;