import { Link } from "react-router-dom";
// import "./navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
        <Link to="/">Se connecter</Link>
        <Link to="/logout">Se déconnecter</Link>
        <Link to="/register">S&apos;inscrire</Link>
        <Link to="/listings">Annonces</Link>
        <Link to="/account">Mon compte</Link>
    </nav>
  );
}

export default Navbar;
