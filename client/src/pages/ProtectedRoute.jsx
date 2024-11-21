import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ allowedRoles, handleLogout }) => {
    const role = localStorage.getItem('role');

    if (!(role && allowedRoles.includes(role))) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <Outlet />
        </>
    );
};

ProtectedRoute.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleLogout: PropTypes.func
};

export default ProtectedRoute;
