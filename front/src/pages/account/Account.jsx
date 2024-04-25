import { useEffect, useState } from 'react';
import ErrorComponent from '../../components/error/ErrorComponent';
import './Account.css';

function Account() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    fetch('http://localhost:3001/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Inclure le token d'authentification
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(`Erreur: ${response.status} - ${response.statusText}`);
        }
      })
      .then((data) => {
        setUserData(data.value.user);
        setIsLoading(false);
      })
      .catch((err) => {
        setError('Impossible de récupérer les données utilisateur');
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const handleUpdate = () => {
    const token = localStorage.getItem('authToken');
    const updatedData = {
      username: userData.username,
      email: userData.email,
      // ajoutez d'autres champs à mettre à jour
    };

    fetch('http://localhost:3001/api/user', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Inclure le token d'authentification
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error(`Erreur: ${response.status} - ${response.statusText}`);
      })
      .then(() => {
        setEditMode(false); // Sortir du mode édition
      })
      .catch((err) => {
        console.error(err);
        setError('Impossible de mettre à jour les données utilisateur');
      });
  };

  const handleDeleteAccount = () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
      return; // Si l'utilisateur annule la suppression
    }
  
    const token = localStorage.getItem('authToken');
  
    fetch('http://localhost:3001/api/user', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Inclure le token d'authentification
      },
    })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem('authToken'); // Supprimer le token
          window.location.replace('/'); // Rediriger vers la page de connexion
        } else {
          throw new Error(`Erreur: ${response.status} - ${response.statusText}`);
        }
      })
      .catch((err) => {
        setError('Impossible de supprimer le compte');
        console.error(err);
      });
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='my-account'>
      <h1>Bienvenue sur votre espace personnel !</h1>
      {editMode ? (
        <div>
          <label>
            Nom d&apos;utilisateur :
            <input
              type="text"
              value={userData.username}
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            />
          </label>
          <label>
            Email :
            <input
              type="text"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
          </label>
          <button onClick={handleUpdate}>Enregistrer</button> {/* Bouton pour sauvegarder */}
          <button onClick={() => setEditMode(false)}>Annuler</button> {/* Pour annuler */}
        </div>
      ) : (
        <div>
          <p>Nom d&apos;utilisateur : {userData.username}</p>
          <p>Email : {userData.email}</p>
          <button onClick={() => setEditMode(true)}>Modifier</button> {/* Pour passer en mode édition */}
          <button onClick={handleDeleteAccount}>Supprimer le compte</button> {/* Bouton de suppression */}
        </div>
      )}
        {error && <ErrorComponent message={error} />}
    </div>
  );
}

export default Account;
