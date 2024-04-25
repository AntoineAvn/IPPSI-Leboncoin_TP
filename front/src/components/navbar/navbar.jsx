import { Link } from "react-router-dom";
import "./Navbar.css"; 

function Navbar() {
  return (
    <nav className="navbar"> 
        <Link to="/">Se connecter</Link>
        <Link to="/">Se déconnecter</Link>
        <Link to="/register">S&apos;inscrire</Link>
        <Link to="/home">Annonces</Link>
        <Link to="/account">Mon compte</Link>
    </nav>
  );
}

export default Navbar;