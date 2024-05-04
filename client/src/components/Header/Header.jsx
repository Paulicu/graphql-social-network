import { Link } from 'react-router-dom';

import Navbar from './Navbar';
import SearchBar from './SearchBar';
import Icon from './Icon';
import { useAuth } from '../../utils/context';

function Header() {

    const currentUser = useAuth();

    return (

        <header className="bg-black p-4 sticky top-0 z-50 rounded-b-lg">
            <nav className="container mx-auto flex items-center justify-between">
                <div className="flex items-center justify-between">
                    <div className="ml-5">
                        <Navbar />
                    </div>
                </div>
                
                <div className="flex items-center justify-center flex-grow">
                    <SearchBar />
                </div>
                
                <div className="flex items-center justify-between">
                    { (currentUser) && (currentUser.role === "ADMIN") && (
                        <div className="ml-5">
                            <Link to="/dashboard" className="text-white text-xl font-bold ml-5">
                                Dashboard
                            </Link>
                        </div>)
                    }

                    <div className="ml-10">
                        <Icon />
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;