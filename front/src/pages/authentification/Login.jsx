import React, { useState } from 'react';
import './Login.css'; // Importer le fichier CSS

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envoyer les données de connexion au serveur pour authentification
    // (à implémenter)

  };

  return (
    <div className="login-container"> {/* Ajouter une classe pour appliquer les styles */}
      <h2>Connexion</h2>
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
        <button type="submit">Se connecter</button> {/* Bouton de connexion */}
      </form>
      <p>Vous n&apos;avez pas de compte ? </p>
      <a href="/register">Inscrivez-vous</a> {/* Lien vers la page d'inscription */}
    </div>
  );
};

export default LoginPage;