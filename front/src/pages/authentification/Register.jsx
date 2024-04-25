import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importez Link depuis react-router-dom
import './Login.css'; 

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envoyer les données d'inscription au serveur pour création de compte
    // (à implémenter)
  };

  return (
    <div className="login-container"> {/* Appliquez la classe commune */}
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">S'inscrire</button>
      </form>
      <p>Vous n&apos;avez déjà un compte ? </p>
      <Link to="/">Connectez vous !</Link> {/* Retour a la page de Login */}
    </div>
  );
};

export default RegisterPage;