import Navbar from './Navbar';
import Icon from './Icon';

function Header() {

    return (

        <header className="bg-black p-4 sticky top-0 z-50 rounded-b-lg">
            <nav className="container mx-auto flex items-center justify-between">
                <div className="flex items-center justify-between">
                    <div className="ml-5">
                        <Navbar />
                    </div>
                </div>
                
                <div className="flex items-center justify-center flex-grow">
                  
                </div>
                
                <div className="flex items-center justify-between">
                    

                    <div className="ml-5">
                       
                    </div>
                    
                    <div className="ml-5">
                        <Icon />
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;