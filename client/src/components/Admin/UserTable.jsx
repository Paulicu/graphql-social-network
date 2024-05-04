import { useQuery } from '@apollo/client';
import { GET_USERS } from '../../graphql/queries/user';

import UserRow from './UserRow';

function UserTable() {

    const { data, loading, error } = useQuery(GET_USERS);

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    return (

        <table>
            <thead>
                <tr> 
                    <th>Profile Picture</th>
                    <th>Full Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Join Date</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                { data.users.map(user => (<UserRow key={ user._id } user={ user } />)) }
            </tbody>
        </table>
    );
}

export default UserTable;