import ChangeRoleButton from './ChangeRoleButton';

function UserRow({ user }) {

    return (

        <tr> 
            <td>
                { user.profilePicture && <img src={ user.profilePicture } alt="Profile" className="w-24 h-24"/> }
            </td>
            <td>{ user.fullName }</td>
            <td>{ user.username }</td>
            <td>{ user.email }</td>
            <td>{ user.gender }</td>
        
            <td>{ user.createdAtFormatted }</td>
            <td>
                <ChangeRoleButton userId={ user._id } currentRole={ user.role } />
            </td>
        </tr>
    );
}

export default UserRow;