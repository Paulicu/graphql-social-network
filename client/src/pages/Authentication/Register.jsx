import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../../graphql/mutations/user';

import { Link } from 'react-router-dom';

function Register() {

    const [registerData, setRegisterData] = useState(
    { 
        firstName:"", 
        lastName: "", 
        username: "", 
        password: "", 
        email: "", 
        gender: "" 
    });

    const [register, { loading, error }] = useMutation(REGISTER, { refetchQueries: ["GetAuthenticatedUser"] });

    const handleSubmit = async (e) => {

        e.preventDefault();
        try {

            await register({ variables: { input: registerData } });
        } 
        catch (err) {

            console.error("Error registering user:", err);
        }
    };

    const handleChange = (e) => {

		const { name, value, type } = e.target;

		if (type === "radio") {

			setRegisterData((prevData) => ({ ...prevData, gender: value }));
		} 
        else {

			setRegisterData((prevData) => ({ ...prevData, [name]: value }));
		}
	};

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex bg-gray-300 z-30 rounded-lg overflow-hidden">
                <div className="flex justify-center items-center bg-gray-100 w-full min-w-80 sm:min-w-96">
                    <div className="w-full p-6 max-w-md">
                        <h2 className="text-center text-3xl font-semibold mb-6 text-black">
                            Register
                        </h2>

                        <h2 className="text-center text-sm font-semibold mb-6 text-gray-500">
                            Join to keep track of your fitness journey!
                        </h2>

                        <form className="space-y-4" onSubmit={ handleSubmit }>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label htmlFor="firstName" className="text-gray-700 font-medium text-sm block">First Name</label>
                                    <input
                                        id="firstName"
                                        className="mt-1 p-2 w-full border rounded-md text-black"
                                        type="text"
                                        name="firstName"
                                        value={ registerData.firstName }
                                        onChange={ handleChange }
                                    />
                                </div>

                                <div className="w-1/2">
                                    <label htmlFor="lastName" className="text-gray-700 font-medium text-sm block">Last Name</label>
                                    <input
                                        id="lastName"
                                        className="mt-1 p-2 w-full border rounded-md text-black"
                                        type="text"
                                        name="lastName"
                                        value={ registerData.lastName }
                                        onChange={ handleChange }
                                    />
                                </div>
                            </div>

                            <label htmlFor="username" className="text-gray-700 font-medium text-sm block">Username</label>
                            <input 
                                id="username"
                                className="mt-1 p-2 w-full border rounded-md text-black"
                                type="text" 
                                name="username" 
                                value={ registerData.username } 
                                onChange={ handleChange }  
                            />

                            <label htmlFor="email" className="text-gray-700 font-medium text-sm block">Email Address</label>
                            <input 
                                id="email"
                                className="mt-1 p-2 w-full border rounded-md text-black"
                                type="text" 
                                name="email" 
                                value={ registerData.email } 
                                onChange={ handleChange }  
                            />

                            <label htmlFor="password" className="text-gray-700 font-medium text-sm block">Password</label>
                            <input 
                                id="password"
                                className="mt-1 p-2 w-full border rounded-md text-black"
                                type="password" 
                                name="password" 
                                value={ registerData.password } 
                                onChange={ handleChange }  
                            />

                            <div className="flex gap-10">
                                <div className="flex items-center">
                                    <input 
                                        id="male"
                                        className="text-black border-gray-300"
                                        type="radio" 
                                        name="gender" 
                                        value="MALE" 
                                        checked={ registerData.gender === "MALE" } 
                                        onChange={ handleChange } 
                                    /> 
                                    <label htmlFor="male" className="ml-2 mt-px font-light text-gray-700 cursor-pointer select-none">Male</label>
                                </div>

                                <div className="flex items-center">
                                    <input 
                                        id="female"
                                        className="text-black border-gray-300"
                                        type="radio" 
                                        name="gender" 
                                        value="FEMALE" 
                                        checked={ registerData.gender === "FEMALE" } 
                                        onChange={ handleChange } 
                                    /> 
                                    <label htmlFor="female" className="ml-2 mt-px font-light text-gray-700 cursor-pointer select-none">Female</label>
                                </div>
                            </div>

                            <div>
                                <button type="submit" disabled={ loading } className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed" >
                                    { loading ? "Loading..." : "Register" }
                                </button>
                            </div>
                        </form>

                        { error && <p className="text-red-500 mt-2 text-center font-medium">{ error.message }</p> }

                        <div className="mt-4 text-sm text-gray-600 text-center">
							<p>
								Already have an account?{ " " }

								<Link to='/login' className="text-black font-medium hover:underline">
									Login here
								</Link>
							</p>
						</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;