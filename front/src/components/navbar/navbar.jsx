
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';
import Logout from '../logout/LogoutComponent';
import './navbar.css';

function Navbar() {
  const { isAuthenticated } = useContext(AuthContext); // Utilisez le contexte d'authentification

  return (
    <nav className="navbar">
      {!isAuthenticated && ( // Masquer ces liens si l'utilisateur est authentifié
        <>
          <Link to="/">Se connecter</Link>
          <Link to="/register">S&apos;inscrire</Link>
        </>
      )}
      {isAuthenticated && (
        <>
          <Link to="/home">Annonces</Link>
          <Link to="/account">Mon compte</Link>
          <Link to="/favoris">Mes favoris</Link>
          <Logout />
        </>
      )}
    </nav>
  );
}

export default Navbar;
