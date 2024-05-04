import { useMutation } from '@apollo/client';
import { CHANGE_ROLE } from '../../graphql/mutations/user';

function ChangeRoleButton({ userId, currentRole }) {

    const [changeRole, { loading }] = useMutation(CHANGE_ROLE, 
    {
        variables: {
            userId,
            role: currentRole === 'ADMIN' ? 'MEMBER' : 'ADMIN'
        },
        refetchQueries: ['GetUsers']
    });

    const handleRoleChange = () => {
        changeRole();
    };

    return (

        <button onClick={ handleRoleChange } disabled={ loading }>
            { currentRole === 'ADMIN' ? 'Demote' : 'Promote' }
        </button>
    );
}

export default ChangeRoleButton;
