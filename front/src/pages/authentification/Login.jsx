import { useState } from 'react';
import './Login.css'; // Importer le fichier CSS
import ErrorComponent from '../../components/error/ErrorComponent';

const LoginPage = () => {
  const [email, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Send a POST request to the API
    fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        // On vérifie si le statut de la réponse HTTP est 200 (OK)
        if (res.status === 200) {
          return res.json();
        } else {
          // Si le statut n'est pas 200, on renvoie une erreur
          return Promise.reject(`Error: ${res.status} - ${res.statusText}`);
        }
      })
      .then((data) => {
        // Si le statut était 200, on redirige vers la page de connexion
        console.log(data);
        window.location.replace('/home');
      })
      .catch((err) => {
        // Gérer les erreurs ou les statuts autres que 201
        setError('Erreur lors de la connexion'); 
        console.error(err);
      });

  };

  return (
    <div className="login-container"> {/* Ajouter une classe pour appliquer les styles */}
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setMail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Se connecter</button> {/* Bouton de connexion */}
      </form>
      <ErrorComponent errorMessage={error} /> {/* Afficher l'erreur */}
      <p>Vous n&apos;avez pas de compte ? </p>
      <a href="/register">Inscrivez-vous</a> {/* Lien vers la page d'inscription */}
    </div>
  );
};

export default LoginPage;