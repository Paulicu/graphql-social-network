import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { LOGOUT } from '../../graphql/mutations/user';
import { GET_AUTHENTICATED_USER } from '../../graphql/queries/user';
import { FaRegUserCircle } from 'react-icons/fa';

function Icon() {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [logout, { loading: logoutLoading, client }] = useMutation(LOGOUT, { refetchQueries: ['GetAuthenticatedUser'] });

    const handleLogout = async () => {

        try {

            await logout();
            client.resetStore();
            setDropdownOpen(false);
        } 
        catch (err) {

            console.error("Error logging out: ", err);
        }
    };

    const { data: userData } = useQuery(GET_AUTHENTICATED_USER);

    const toggleDropdown = () => {

        setDropdownOpen((prevState) => !prevState);
    };

    const handleOptionClick = () => {

        setDropdownOpen(false);
    };

    const handleClickOutside = (e) => {

        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {

            setDropdownOpen(false);
        }
    };

    useEffect(() => {

        document.addEventListener('click', handleClickOutside);
        return () => {

            document.removeEventListener('click', handleClickOutside);
        };

    }, []);

    return (

        <div className="relative" ref={ dropdownRef }>
            <div className="text-white cursor-pointer" onClick={ toggleDropdown }>
                { userData && userData.authUser ? 
                    (<div className="flex items-center">
                        { userData.authUser.firstName && (<span className="mr-3">{ userData.authUser.firstName }</span>) }

                        <img src={ userData.authUser.profilePicture } alt="Profile Picture" className="w-11 h-11 rounded-full" />
                    </div>) : 
                    
                    (<FaRegUserCircle className="w-11 h-11" />)
                }
            </div>

            { dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
                    <ul>
                        { userData && userData.authUser ? 
                            (<>
                                <li>
                                    <Link to="/profile" onClick={ handleOptionClick } className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                        Profile
                                    </Link>
                                </li>

                                <li>
                                    <button onClick={ handleLogout } disabled={ logoutLoading } className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">
                                        { logoutLoading ? 'Logging Out...' : 'Log Out' }
                                    </button>
                                </li>
                            </>) : 

                            (<>
                                <li>
                                    <Link to="/login" onClick={ handleOptionClick } className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                        Log In
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/register" onClick={ handleOptionClick } className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                        Register
                                    </Link>
                                </li>
                            </>)
                        }
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Icon;