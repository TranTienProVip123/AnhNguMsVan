import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const { token, loading } = useAuth();
    const location = useLocation();

    if (loading) return null;
    //neu chua dang nhap,ko xem dc va bat login
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};
