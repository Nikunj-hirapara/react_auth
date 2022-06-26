import { useLocation, Navigate, Outlet } from "react-router-dom";
import useStore from '../context/AuthProvider';

const RequireAuth = ({ allowedRoles }) => {
    const state = useStore();
    const location = useLocation();

    return (
        state?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : state?.user
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;