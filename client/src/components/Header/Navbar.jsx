import { Link } from "react-router-dom";

function Navbar() {

    return (
        
        <div>
            <Link to="/" className="text-white text-xl font-bold">
                Home
            </Link>

            <Link to="/articles" className="text-white text-xl font-bold ml-5">
                Articles
            </Link>
        </div>
    );
}

export default Navbar;