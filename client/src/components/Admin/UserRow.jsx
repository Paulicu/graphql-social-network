import { FaEnvelope, FaIdBadge } from 'react-icons/fa';
import ChangeRoleButton from './ChangeRoleButton';

function UserRow({ user }) {
    return (
        <tr className="bg-white border-b hover:bg-gray-50">
            <th scope="row" className="flex items-center px-6 py-4 text-gray-900">
                <img src={ user.profilePicture } alt={ `${ user.username } Profile Picture` } className="w-11 h-11 rounded-full" />

                <div className="pl-3">
                    <div className="text-base font-semibold">{ user.fullName }</div>
                    <div className="flex items-center font-normal text-gray-500">
                        <FaIdBadge className="mr-2" />{ user.username }
                    </div>
                    <div className="flex items-center font-normal text-gray-500">
                        <FaEnvelope className="mr-2" /> { user.email }
                    </div>
                </div>
            </th>

            <td className="px-6 py-4">{ user.gender }</td>
            <td className="px-6 py-4">{ user.createdAtFormatted }</td>
            <td className="px-6 py-4">{ user.role }</td>
            
            <td className="px-6 py-4">
                <ChangeRoleButton userId={ user._id } currentRole={ user.role } />
            </td>
        </tr>
    );
}

export default UserRow;