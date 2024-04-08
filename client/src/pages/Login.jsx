import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutations/users";

function Login() {

    const [loginData, setLoginData] = useState({ username: "", password: "" });

    const [login, { loading, error }] = useMutation(LOGIN, { refetchQueries: ["GetAuthenticatedUser"] });

    const handleSubmit = async (e) => {

        e.preventDefault();
        try {

            await login({ variables: { input: loginData } });
            console.log('User logged in successfully!');
        } 
        catch (err) {

            console.error('Error logging in:', err);
        }
    };

    const handleChange = (e) => {

        const { name, value } = e.target;
        setLoginData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (

        <div className="flex justify-center items-center h-screen">
            <div className="flex bg-gray-300 z-30 rounded-lg overflow-hidden">
                <div className="flex justify-center items-center bg-gray-100 w-full min-w-80 sm:min-w-96">
                    <div className="w-full p-6 max-w-md">
                        <h2 className="text-center text-3xl font-semibold mb-6 text-black">
                            Log in
                        </h2>

                        <h2 className="text-center text-sm font-semibold mb-6 text-gray-500">
                            Welcome back!
                        </h2>

                        <form onSubmit={ handleSubmit } className="space-y-4">
                            <label htmlFor="username" className="block text-gray-700">Username</label>
                            <input
                                id="username"
                                className="w-full border rounded-md py-2 px-3"
                                type="text"
                                name="username"
                                value={ loginData.username }
                                onChange={ handleChange }
                            />
                        
                            <label htmlFor="password" className="block text-gray-700">Password</label>
                            <input
                                id="password"
                                className="w-full border rounded-md py-2 px-3"
                                type="password"
                                name="password"
                                value={ loginData.password }
                                onChange={ handleChange } 
                            />
                            
                            <button type="submit" disabled={ loading } className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                                { loading ? 'Loading...' : 'Log in' }
                            </button>
                        </form>

                        { error && <p className="text-red-500 mt-2 text-center font-medium">{ error.message }</p> }

                        <div className="mt-4 text-sm text-gray-600 text-center">
                            <p>
                                { "Don't" } have an account?{ " " }

                                <Link to='/register' className="text-black font-medium hover:underline">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;