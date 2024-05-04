import { Navigate, Route, Routes } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_AUTHENTICATED_USER } from './graphql/queries/user';

import Home from './pages/Home/Home';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import Dashboard from './pages/Admin/Dashboard';
import Articles from './pages/Article/Articles';
import Article from './pages/Article/Article';
import Exercises from './pages/Exercise/Exercises';
import Exercise from './pages/Exercise/Exercise';
import Workouts from './pages/Workout/Workouts';
import Workout from './pages/Workout/Workout';
import Programs from './pages/Program/Programs';
import Program from './pages/Program/Program';
import NotFound from './pages/NotFound/NotFound';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import { AuthContext } from './utils/context';


function App() {

    const { loading, error, data } = useQuery(GET_AUTHENTICATED_USER);

	if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    return (
        
        <AuthContext.Provider value={ data.authUser }>
            <Header />
      
            <Routes>
                <Route path="/" element={ <Home /> } />
                <Route path="/login" element={ !data.authUser ? <Login /> : <Navigate to='/' /> } />
                <Route path="/register" element={ !data.authUser ? <Register /> : <Navigate to='/' /> } />
                <Route path="/dashboard" element={ (data.authUser && data.authUser.role === "ADMIN") ? <Dashboard /> : <Navigate to='/' /> } />

                <Route path="/articles" element={ <Articles /> } />
                <Route path="/article/:articleId" element={ <Article /> } />

                <Route path="/exercises" element={ <Exercises /> } />
                <Route path="/exercise/:exerciseId" element={ <Exercise /> } />

                <Route path="/workouts" element={ <Workouts /> } />
                <Route path="/workout/:workoutId" element={ <Workout /> } />

                <Route path="/programs" element={ <Programs /> } />
                <Route path="/program/:programId" element={ <Program /> } />

                <Route path="*" element={ <NotFound /> } />
            </Routes>

            <Footer />
        </AuthContext.Provider>
    );
}

export default App;
