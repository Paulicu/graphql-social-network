import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { LOGOUT } from '../../graphql/mutations/user';
import { FaRegUserCircle } from 'react-icons/fa';
import { useAuth } from '../../utils/context';

function Icon() {
    const currentUser = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [logout, { loading, client }] = useMutation(LOGOUT, { refetchQueries: ["GetAuthenticatedUser"] });

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
                { currentUser ? 
                    (<div className="flex items-center">
                        { currentUser.firstName && (<span className="mr-3">{ currentUser.firstName }</span>) }

                        <img src={ currentUser.profilePicture } alt="Profile Picture" className="w-11 h-11 rounded-full" />
                    </div>) : (<FaRegUserCircle className="w-11 h-11" />)
                }
            </div>

            { dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
                    <ul>
                        { currentUser ? 
                            (<button onClick={ handleLogout } disabled={ loading } className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">
                               { loading ? "Logging Out..." : "Log Out" }
                            </button>) : 

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