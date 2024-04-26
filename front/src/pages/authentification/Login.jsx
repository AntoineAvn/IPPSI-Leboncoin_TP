import { useState, useContext } from 'react';
import './Login.css'; // Importer le fichier CSS
import ErrorComponent from '../../components/error/ErrorComponent';
import { AuthContext } from '../../utils/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [redirectToHome, setRedirectToHome] = useState(false);
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

        localStorage.setItem('authToken', data.value.token);
        setIsAuthenticated(true); // Met à jour le contexte d'authentification
        setRedirectToHome(true); 
      })
      .catch((err) => {
        // Gérer les erreurs ou les statuts autres que 201
        setError('Erreur lors de la connexion'); 
        console.error(err);
      });

  };

  if (redirectToHome) {
    return <Navigate to="/home" />; // Redirige sans recharger la page
  }

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
      {error &&<ErrorComponent errorMessage={error} />}
      <p>Vous n&apos;avez pas de compte ? </p>
      <a href="/register">Inscrivez-vous</a> {/* Lien vers la page d'inscription */}
    </div>
  );
};

export default LoginPage;