import { useEffect, useState } from 'react';
import ErrorComponent from '../../components/error/ErrorComponent';
import './Account.css';

function Account() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [announces, setAnnounces] = useState([]); // État pour stocker les annonces
  const [editAnnounce, setEditAnnounce] = useState(null);
  const [newAnnounce, setNewAnnounce] = useState({
    title: '',
    description: '',
    price: '',
    isSell: true,
    categories: [],
  });
  const [categories, setCategories] = useState([]);

   // Récupérer les catégories
   useEffect(() => {
    const token = localStorage.getItem('authToken');

    fetch('http://localhost:3001/api/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Inclure le token d'authentification
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCategories(data.value.categories); // Stocke les catégories
      })
      .catch((err) => {
        setError('Impossible de récupérer les catégories');
        console.error(err);
      });
  }, []);


  // Récupérer les données utilisateur
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

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    fetch('http://localhost:3001/api/announces/user', {
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
        setAnnounces(data.value.annonces); // Récupère les annonces
        setIsLoading(false);
      })
      .catch((err) => {
        setError('Impossible de récupérer les annonces');
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

    // Envoi des données mises à jour
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

  const handleNewAnnounce = (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page

    const token = localStorage.getItem('authToken');

    // Préparer l'objet d'annonce avec les catégories sélectionnées
    const announceToCreate = {
      ...newAnnounce,
      categories: [newAnnounce.category], // Utiliser la catégorie sélectionnée
    };

    fetch('http://localhost:3001/api/announce', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Inclure le token d'authentification
      },
      body: JSON.stringify(announceToCreate), // Envoyer les données de la nouvelle annonce
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        }
        throw new Error(`Erreur: ${response.status} - ${response.statusText}`);
      })
      .then((data) => {
        // console.log(data);
        setAnnounces([...announces, data.value.announce]); // Ajouter l'annonce à la liste
      })
      .catch((err) => {
        setError('Impossible de créer l\'annonce');
        console.error(err);
      });
  };

  const handleEdit = (announce) => {
    setEditAnnounce(announce); // Passe en mode édition pour une annonce
  };

  const handleUpdateAnnounce = (announce) => {
    const token = localStorage.getItem('authToken');

    fetch(`http://localhost:3001/api/announce/${announce._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Inclure le token d'authentification
      },
      body: JSON.stringify(announce), // Envoyer les données mises à jour
    })
      .then((response) => {
        if (response.status === 200) {
          setEditAnnounce(null); // Sortir du mode édition
        } else {
          throw new Error(`Erreur: ${response.status} - ${response.statusText}`);
        }
      })
      .catch((err) => {
        setError('Impossible de mettre à jour l\'annonce');
        console.error(err);
      });
  };

  const handleDelete = (announce) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      return; // Si l'utilisateur annule la suppression
    }

    const token = localStorage.getItem('authToken');

    fetch(`http://localhost:3001/api/announce/${announce._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Inclure le token d'authentification
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setAnnounces(announces.filter((a) => a._id !== announce._id)); // Supprimer l'annonce de la liste
        } else {
          throw new Error(`Erreur: ${response.status} - ${response.statusText}`);
        }
      })
      .catch((err) => {
        setError('Impossible de supprimer l\'annonce');
        console.error(err);
      });
  };


  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className='account-container'>
        <h1>Bienvenue sur votre espace personnel !</h1>
        <ErrorComponent message={error} />
      <div className='my-info'>
        <h2>Vos informations</h2>
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
            <button onClick={handleUpdate}>Enregistrer</button> 
            <button onClick={() => setEditMode(false)}>Annuler</button>
          </div>
        ) : (
          <div>
            <p>Nom d&apos;utilisateur : {userData.username}</p>
            <p>Email : {userData.email}</p>
            <button onClick={() => setEditMode(true)}>Modifier</button> 
            <button onClick={handleDeleteAccount}>Supprimer le compte</button>
          </div>
        )}
          {error && <ErrorComponent message={error} />}
      </div>
      <div className="create-announce">
        <h2>Créer une nouvelle annonce</h2>
        <form onSubmit={handleNewAnnounce}> 
            <input
              type="text"
              value={newAnnounce.title}
              placeholder="Titre"
              onChange={(e) => setNewAnnounce({ ...newAnnounce, title: e.target.value })}
            />
              <input
                type="text"
                value={newAnnounce.description}
                placeholder="Description"
                onChange={(e) => setNewAnnounce({ ...newAnnounce, description: e.target.value })}
              />
            <input
              type="number"
              value={newAnnounce.price}
              placeholder="Prix"
              onChange={(e) => setNewAnnounce({ ...newAnnounce, price: e.target.value })}
            />
            <select
              value={newAnnounce.category}
              onChange={(e) => setNewAnnounce({ ...newAnnounce, category: e.target.value })}
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
            <input
              type="checkbox"
              hidden
              checked={newAnnounce.isSell}
              onChange={() => setNewAnnounce({ ...newAnnounce, isSell: false })}
            />
          <button type="submit">Créer</button>
        </form>
      </div>
      <div className="my-announces">
        <h2>Vos annonces</h2>
        {announces.length === 0 ? (
          <p>Vous n&apos;avez pas encore d&apos;annonce.</p>
        ) : (
          <ul>
            {announces.map((announce) => (
              <li key={announce._id}>
                {editAnnounce && editAnnounce._id === announce._id ? (
                  <div>

                      <input
                        type="text"
                        value={editAnnounce.title}
                        onChange={(e) =>
                          setEditAnnounce({ ...editAnnounce, title: e.target.value })
                        }
                      />
                      
                      <input
                        type="text"
                        value={editAnnounce.description}
                        onChange={(e) =>
                          setEditAnnounce({ ...editAnnounce, description: e.target.value })
                        }
                      />
                      
                      <input
                        type="number"
                        value={editAnnounce.price}
                        onChange={(e) =>
                          setEditAnnounce({ ...editAnnounce, price: e.target.value })
                        }
                      />
                      Vendu :
                      <input
                        type="checkbox"
                        checked={editAnnounce.isSell}
                        onChange={(e) =>
                          setEditAnnounce({ ...editAnnounce, isSell: e.target.checked })
                        }
                      />
                      <div>
                      <button
                      onClick={() => handleUpdateAnnounce(editAnnounce)}
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setEditAnnounce(null)} // Annuler le mode édition
                    >
                      Annuler
                    </button>
                      </div>

                  </div>
                ) : (
                  <div>
                    <h3>{announce.title}</h3>
                    <p>{announce.categories.map((category) => category.title).join(', ')}</p>
                    <p>{announce.description}</p>
                    <p>{announce.price} €</p>
                    <p>Vendu: {announce.isSell ? 'Oui' : 'Non'}</p>
                    <p>{new Date(announce.createdAt).toLocaleDateString()}</p>
                    <div>
                      <button onClick={() => handleEdit(announce)}>Modifier</button>
                      <button onClick={() => handleDelete(announce)}>Supprimer</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Account;
