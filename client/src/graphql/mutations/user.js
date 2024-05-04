import { gql } from '@apollo/client';

export const REGISTER = gql`
    mutation Register($input: RegisterInput!) {
        register(input: $input) {
            _id
            fullName
            username
            email
        }
    }
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			_id
			fullName
			username
            email
		}
	}
`;

export const LOGOUT = gql`
    mutation Logout {
        logout {
            message
        }
    }
`;

export const CHANGE_ROLE = gql`
    mutation ChangeRole($userId: ID!, $role: Role!) {
        changeRole(userId: $userId, role: $role) {
            _id
            role
        }
    }
`;