import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_EXERCISE_BY_ID } from '../graphql/queries/exercise';

function Exercise() {

    const { exerciseId } = useParams();

    const { loading, error, data } = useQuery(GET_EXERCISE_BY_ID, 
    {
        variables: { exerciseId },
    });
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong! {error.message}</p>;

    const exercise = data.exerciseById;

    return (

        <div className="max-w-3xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">
                { exercise.name }
            </h2>

            <p>
                <span className="font-semibold">
                    Body Part:
                </span> 

                { exercise.bodyPart }
            </p>

            <p>
                <span className="font-semibold">
                    Equipment:
                </span> 
                
                { exercise.equipment }
            </p>

            <img 
                src={ exercise.gifUrl } 
                alt={ exercise.name } 
                className="mt-4 w-full max-w-lg mx-auto" 
            />

            <p>
                <span className="font-semibold">
                    Target Muscles:
                </span> 

                { exercise.target }
            </p>

            <p>
                <span className="font-semibold">
                    Secondary Muscles:
                </span> 

                { exercise.secondaryMuscles.join(', ') }
            </p>

            <h3 className="text-lg font-bold mt-4">
                Instructions:
            </h3>

            <ul className="list-disc ml-6 mt-2">
                { exercise.instructions.map((instruction, index) => (
                    <li key={ index }>
                        { instruction }
                    </li>))
                }
            </ul>
        </div>
    );
}

export default Exercise;