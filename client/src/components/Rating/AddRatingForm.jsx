import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_RATING } from '../../graphql/mutations/rating';

function AddRatingForm({ programId }) {

    const [ratingData, setRatingData] = useState({ stars: 0, message: ""});

    const [addRating] = useMutation(ADD_RATING, 
    {
        variables: { programId, input: ratingData },
        refetchQueries: ["GetRatingsByProgram", "GetPrograms", "GetProgram"],
    });

    const handleSubmit = async () => {

        try {

            await addRating();
            setRatingData({ stars: 0, message: "" });
        } 
        catch (err) {

            console.error("Error adding Rating:", err);
        }
    };

    const handleChange = async(e) => {

        const { name, value } = e.target;

        if (name === "stars") {

            setRatingData({ ...ratingData, [name]: parseInt(value) });
        }
        else {

            setRatingData({ ...ratingData, [name]: value});
        }
    }

    return (

        <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">
                Add Rating
            </h2>

            <select value={ ratingData.stars } onChange={ handleChange } name="stars" className="w-full p-2 border rounded">
                <option value={ 0 }>Select Rating ... </option>
                <option value={ 1 }>⭐</option>
                <option value={ 2 }>⭐⭐</option>
                <option value={ 3 }>⭐⭐⭐</option>
                <option value={ 4 }>⭐⭐⭐⭐</option>
                <option value={ 5 }>⭐⭐⭐⭐⭐</option>
            </select>

            <textarea
                value={ ratingData.message }
                onChange={ handleChange }
                name="message"
                rows={ 4 }
                placeholder="Add a message (optional) ..."
                className="w-full p-2 border rounded mt-2"
            />

            <button onClick={ handleSubmit } className="mt-2 bg-black text-white py-2 px-4 rounded">
                Add Rating
            </button>
        </div>
    );
}

export default AddRatingForm;