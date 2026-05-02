import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (isAuthenticated) {
        const searchParams = new URLSearchParams(location.search);
        const redirect = searchParams.get('redirect');
        return <Navigate to={redirect ? decodeURIComponent(redirect) : '/dashboard'} replace />;
    }

    return children;
};

export default PublicRoute;
