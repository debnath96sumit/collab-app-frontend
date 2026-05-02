import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');

    // if (token) {
    //     return <Navigate to="/dashboard" replace />;
    // }

    if (token) {
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get('redirect');
        return <Navigate to={redirect ? decodeURIComponent(redirect) : '/dashboard'} replace />;
    }

    return children;
};

export default PublicRoute;
