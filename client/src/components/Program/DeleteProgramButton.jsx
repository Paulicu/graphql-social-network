import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { DELETE_PROGRAM } from '../../graphql/mutations/program';
import { FaTrash } from 'react-icons/fa';

function DeleteProgramButton({ programId }) {
    const redirect = useNavigate();

    const [deleteProgram] = useMutation(DELETE_PROGRAM, {
        variables: { programId },
        refetchQueries: ["GetPrograms"],
        onCompleted: () => redirect("/programs")
    });

    const handleDelete = async () => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this Program?");
            if (confirmDelete) {
                await deleteProgram();
            }
        } 
        catch (err) {
            console.error("Error deleting Program:", err);
        }
    };

    return (
        <button onClick={ handleDelete } className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-400">
            <FaTrash className="mr-2" /> Delete Program
        </button>
    );
}

export default DeleteProgramButton;