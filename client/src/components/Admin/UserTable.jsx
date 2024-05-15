import { useQuery } from '@apollo/client';
import { GET_USERS } from '../../graphql/queries/user';

import UserRow from './UserRow';

function UserTable() {
    const { data, loading, error } = useQuery(GET_USERS);

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    return (
        <div className="overflow-x-auto relative shadow-md my-4 sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Details</th>
                        <th scope="col" className="px-6 py-3">Gender</th>
                        <th scope="col" className="px-6 py-3">Join Date</th>
                        <th scope="col" className="px-6 py-3">Role</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                
                <tbody>
                    { data.users.map((user) => (<UserRow key={ user.id } user={ user } />)) }
                </tbody>
            </table>
        </div>
    );
}

export default UserTable;