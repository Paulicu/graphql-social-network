import { gql } from "@apollo/client";

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
