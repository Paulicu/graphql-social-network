import { useEffect, useState } from 'react';

import axios from 'axios';

function WorkoutImage({ muscleGroups }) {

    const [image, setImage] = useState("");

    const baseURL = import.meta.env.VITE_API_URL;

    const fetchImage = async () => {

        try {

            const response = await axios.get(`${ baseURL }/getImage?muscleGroups=${ muscleGroups.join(",") }`, 
            {
                headers: {

                    'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
                    'X-RapidAPI-Host': import.meta.env.VITE_API_HOST,
                },
                responseType: "arraybuffer"
            });
    
            const imageFile = new Blob([response.data]);
            const imageUrl = URL.createObjectURL(imageFile);
            setImage(imageUrl);
        } 
        catch (error) {

            console.error("Error fetching image:", error);
        }
    };

    useEffect(() => { fetchImage() }, []);

    return (

        <img src={ image }  alt={ `Image of ${ muscleGroups.join(",") }` } />
    );
}

export default WorkoutImage;