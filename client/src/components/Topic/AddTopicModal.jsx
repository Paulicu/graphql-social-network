import { useState } from 'react';
import { FaFolderPlus } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { CREATE_TOPIC } from '../../graphql/mutations/topic';

function AddTopicModal() {

    const [showModal, setShowModal] = useState(false);
    const [topicData, setTopicData] = useState({ title: "", description: "" });
    const [createTopic] = useMutation(CREATE_TOPIC,
    { 
        variables: { input: topicData },
        refetchQueries: ["GetTopics"] 
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

            await createTopic();
            setTopicData({ title: "", description: "" });
            toggleModal();
        } 
        catch (err) {

            console.error('Error creating topic:', err);
        }
    };

    return (

        <>
            <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 mr-4 flex items-center" onClick={ toggleModal }>
                <FaFolderPlus className="mr-2" /> Create Topic
            </button>

            { showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">
                            Create Topic
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
                                    required
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
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <button type="button" className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-400 mr-4" onClick={ toggleModal }>
                                    Cancel
                                </button>

                                <button type="submit" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                                    Create
                                </button>                                
                            </div>
                        </form>
                    </div>
                </div>)
            }
        </>
    );
}

export default AddTopicModal;
