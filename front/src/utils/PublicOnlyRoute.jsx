import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import PropTypes from 'prop-types';

const PublicOnlyRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Navigate to="/home" /> : element; // Rediriger si authentifié
};

PublicOnlyRoute.propTypes = {
    element: PropTypes.node.isRequired,
};

export default PublicOnlyRoute;
