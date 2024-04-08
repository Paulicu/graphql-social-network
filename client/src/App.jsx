import { Navigate, Route, Routes } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/users";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {

    const { loading, error, data } = useQuery(GET_AUTHENTICATED_USER);

	if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong! {error.message}</p>;

    return (
        
        <>
            <Header />
      
            <Routes>
                <Route path="/" element={ <Home /> } />
                <Route path="/login" element={ !data.authUser ? <Login /> : <Navigate to='/' /> } />
                <Route path="/register" element={ !data.authUser ? <Register /> : <Navigate to='/' /> } />

                <Route path="*" element={ <NotFound /> } />
            </Routes>

            <Footer />
        </>
    );
}

export default App;
