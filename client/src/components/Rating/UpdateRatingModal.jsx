import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { FaEdit } from 'react-icons/fa';
import { UPDATE_RATING } from '../../graphql/mutations/rating';
import { GET_RATINGS_BY_PROGRAM } from '../../graphql/queries/rating';

function UpdateRatingModal({ rating, programId }) {

    const [showModal, setShowModal] = useState(false);
    const [ratingData, setRatingData] = useState({ stars: rating.stars, message: rating.message });

    const [updateRating, { loading, error }] = useMutation(UPDATE_RATING, 
    { 
        variables: { ratingId: rating._id, input: ratingData },
        refetchQueries: [{ query: GET_RATINGS_BY_PROGRAM, variables: { programId } }] 
    });

    const toggleModal = () => {

        setShowModal(!showModal);
    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name === "stars") {

            setRatingData({ ...ratingData, [name]: parseInt(value) });
        } 
        else {

            setRatingData({ ...ratingData, [name]: value});
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        try {

            await updateRating();
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
                            Edit your rating
                        </h2>

                        <form onSubmit={ handleSubmit } className="space-y-4">
                            <div>
                                <label htmlFor="stars" className="text-gray-700 font-medium text-sm block">
                                    Stars
                                </label>

                                <select id="stars" name="stars" value={ ratingData.stars } onChange={ handleChange } required className="mt-1 p-2 w-full border rounded-md text-black">
                                    <option value={ 0 }>Select Rating ...</option>
                                    <option value={ 1 }>⭐</option>
                                    <option value={ 2 }>⭐⭐</option>
                                    <option value={ 3 }>⭐⭐⭐</option>
                                    <option value={ 4 }>⭐⭐⭐⭐</option>
                                    <option value={ 5 }>⭐⭐⭐⭐⭐</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="text-gray-700 font-medium text-sm block">
                                    Message
                                </label>

                                <textarea
                                    id="message"
                                    className="mt-1 p-2 w-full border rounded-md text-black"
                                    name="message"
                                    value={ ratingData.message }
                                    onChange={ handleChange }
                                    required
                                />
                            </div>
                            { error && <p className="text-red-500 mt-2 text-center font-medium">{ error.message }</p> }
                            <div className="flex justify-end">
                                <button type="button" onClick={ toggleModal } className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-400 mr-4">
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

export default UpdateRatingModal;