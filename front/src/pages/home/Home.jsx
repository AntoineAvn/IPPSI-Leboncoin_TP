import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [announces, setAnnounces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState(''); // État pour stocker la recherche

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    fetch('http://localhost:3001/api/announces', {
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
        setAnnounces(data.value.annonces); // Stocke les annonces
        setIsLoading(false);
      })
      .catch((err) => {
        setError('Impossible de récupérer les annonces');
        console.error(err);
        setIsLoading(false);
      });
  }, []); // L'effet se déclenche une seule fois lors du montage

  const filteredAnnounces = announces.filter((announce) =>
    announce.title.toLowerCase().includes(searchValue.toLowerCase()) // Filtre par titre
  ); // Filtre la liste des annonces en fonction de la recherche

  if (isLoading) {
    return <div>Chargement des annonces...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="home-container">
      <h1>Bienvenue sur notre site d&apos;annonces !</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher une annonce..."
          value={searchValue} // Lier l'état de recherche à l'input
          onChange={(e) => setSearchValue(e.target.value)} // Mettre à jour lors du changement
        />
        <button onClick={() => console.log('Rechercher')}>Rechercher</button> {/* Bouton de recherche */}
      </div>

      <div className="announces-list">
        {filteredAnnounces.length === 0 ? (
          <p>Aucune annonce trouvée</p> // Afficher un message si aucune annonce
        ) : (
          filteredAnnounces.map((announce) => (
            <Link
              key={announce._id}
              to={`/announce/${announce._id}`}
              className="announce-item"
            >
              <h2>{announce.title}</h2>
              <p>{announce.description}</p>
              <p>Prix : {announce.price} €</p>
              <p>{announce.isSell ? 'Vendu' : 'Disponible'}</p>
              <p>Date de création : {new Date(announce.createdAt).toLocaleDateString()}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
