import { Link } from "react-router-dom";
import Logout from "../logout/LogoutComponent";
import "./navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Se connecter</Link>
      <Link to="/register">S&apos;inscrire</Link>
      <Link to="/home">Annonces</Link>
      <Link to="/account">Mon compte</Link>
      <Logout />
    </nav>
  );
}

export default Navbar;
