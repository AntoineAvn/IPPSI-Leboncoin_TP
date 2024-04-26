import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; 
import ErrorComponent from '../../components/error/ErrorComponent';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setMail] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then((res) => {
        // On vérifie si le statut de la réponse HTTP est 201 (Created)
        if (res.status === 201) {
          return res.json();
        } else {
          // Si le statut n'est pas 201, on renvoie une erreur
          return Promise.reject(`Error: ${res.status} - ${res.statusText}`);
        }
      })
      .then((data) => {
        // Si le statut était 201, on redirige vers la page de connexion
        console.log(data);
        window.location.replace('/');
      })
      .catch((err) => {
        setError('Erreur lors de l\'inscription'); 
        console.error(err);
      });
  };
  

  return (
    <div className="login-container">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <button type="submit">S&apos;inscrire</button>
      </form>
        {error && <ErrorComponent errorMessage={error} /> }
      <p>Vous avez déjà un compte ? </p>
      <Link to="/">Connectez vous !</Link>
    </div>
  );
};

export default RegisterPage;