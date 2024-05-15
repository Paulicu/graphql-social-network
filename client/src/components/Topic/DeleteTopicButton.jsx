import { useMutation } from '@apollo/client';
import { DELETE_TOPIC } from '../../graphql/mutations/topic';

import { FaTrash } from 'react-icons/fa';

function DeleteTopicButton({ topicId }) {

    const [deleteTopic] = useMutation(DELETE_TOPIC, {
        variables: { topicId }, 
        refetchQueries: ["GetTopics"] 
    });

    const handleDelete = async () => {
        try {
            await deleteTopic();
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <button onClick={ handleDelete } className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-400">
            <FaTrash />
        </button>
    );
}

export default DeleteTopicButton;