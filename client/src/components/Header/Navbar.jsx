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

            <Link to="/exercises" className="text-white text-xl font-bold ml-5">
                Exercises
            </Link>

            <Link to="/workouts" className="text-white text-xl font-bold ml-5">
                Workouts
            </Link>
        </div>
    );
}

export default Navbar;