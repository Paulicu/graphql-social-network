import { Link } from 'react-router-dom';
import WorkoutImage from '../../components/Workout/WorkoutImage';

function Home() {
    return (
        <>
            <section className="bg-white py-16 text-center">
                <div className="container mx-auto">
                    <WorkoutImage muscleGroups={ ["all"] } className="mx-auto w-1/4" />
                    <div className="mt-8">
                        <h1 className="text-4xl font-bold mb-4">Welcome to Fit Connections!</h1>
                        <p className="text-gray-700 mb-8">Your one-stop solution for fitness articles, exercises, workouts, and programs.</p>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-2xl font-bold mb-4">Articles</h2>
                        <p className="text-gray-700 mb-4">
                            Explore a variety of fitness articles, tips, and guides to help you stay informed and motivated.
                        </p>
                        <Link to="/articles" className="text-black hover:underline">Read Articles</Link>
                    </div>
                    
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-2xl font-bold mb-4">Exercises</h2>
                        <p className="text-gray-700 mb-4">
                            Browse through different exercises, learn proper techniques, and add them to your workout routine.
                        </p>
                        <Link to="/exercises" className="text-black hover:underline">View Exercises</Link>
                    </div>
                    
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-2xl font-bold mb-4">Workouts</h2>
                        <p className="text-gray-700 mb-4">
                            Discover various workouts, customize your own, and track your progress towards your fitness goals.
                        </p>
                        <Link to="/workouts" className="text-black hover:underline">Explore Workouts</Link>
                    </div>
                    
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-2xl font-bold mb-4">Programs</h2>
                        <p className="text-gray-700 mb-4">
                            Find comprehensive fitness programs that combine multiple workouts to help you achieve specific goals.
                        </p>
                        <Link to="/programs" className="text-black hover:underline">Browse Programs</Link>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;