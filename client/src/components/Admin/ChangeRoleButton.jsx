import { useMutation } from '@apollo/client';
import { CHANGE_ROLE } from '../../graphql/mutations/user';
import { GET_USERS } from '../../graphql/queries/user';

function ChangeRoleButton({ userId, currentRole }) {
    const [changeRole, { loading, error }] = useMutation(CHANGE_ROLE, {
        variables: {
            userId,
            role: currentRole === "ADMIN" ? "MEMBER" : "ADMIN"
        },
        refetchQueries: [{ query: GET_USERS }]
    });

    const handleRoleChange = () => {
        const message = currentRole === "ADMIN" ? "Are you sure you want to demote this user to MEMBER?" : "Are you sure you want to promote this user to ADMIN?";
        if (window.confirm(message)) {
            changeRole();
        }
    };

    const buttonColor = currentRole === "ADMIN" ? "bg-red-600  hover:bg-red-400" : "bg-green-600 hover:bg-green-400";
    return (
        <>
            <button onClick={ handleRoleChange } disabled={ loading } className={`flex items-center px-4 py-2 rounded-md text-white ${ buttonColor }` }>
                { currentRole === "ADMIN" ? "Demote" : "Promote" }
            </button>
            { error && <p className="text-red-500 mt-2 text-center font-medium">{ error.message }</p> }
        </>
    );
}

export default ChangeRoleButton;