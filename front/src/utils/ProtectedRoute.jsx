import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Assurez-vous d'importer le contexte approprié
import PropTypes from 'prop-types';

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? element : <Navigate to="/" />;
};

ProtectedRoute.propTypes = {
    element: PropTypes.node.isRequired,    
};


export default ProtectedRoute;
