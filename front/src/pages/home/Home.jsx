import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as heartRegular, faHeart as heartSolid } from '@fortawesome/free-regular-svg-icons';
import ErrorComponent from '../../components/error/ErrorComponent';

function Home() {
  const [announces, setAnnounces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];

    fetch('http://localhost:3001/api/announces', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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
        // Mettre à jour les annonces avec l'état des favoris
        const updatedAnnounces = data.value.annonces.map(announce => ({
          ...announce,
          isFavorite: favorites.includes(announce._id),
        }));
        setAnnounces(updatedAnnounces); // Stocke les annonces
        setIsLoading(false);
      })
      .catch((err) => {
        setError('Impossible de récupérer les annonces');
        console.error(err);
        setIsLoading(false);
      });
  }, [userId]); // L'effet se déclenche une seule fois lors du montage

  const filteredAnnounces = announces.filter((announce) =>
    announce.title.toLowerCase().includes(searchValue.toLowerCase()) // Filtre par titre
  ); // Filtre la liste des annonces en fonction de la recherche

  const toggleFavorite = (id) => {
    // Mettre à jour l'état des favoris
    const updatedAnnounces = announces.map(announce => 
      announce._id === id ? { ...announce, isFavorite: !announce.isFavorite } : announce
    );
    setAnnounces(updatedAnnounces);

    // Mettre à jour le localStorage
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
    const isFavorite = favorites.includes(id);
    const updatedFavorites = isFavorite 
      ? favorites.filter(favId => favId !== id) 
      : [...favorites, id];

    localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
  };

  if (isLoading) {
    return <div>Chargement des annonces...</div>;
  }

  return (
    <div className="home-container">
      <h1>Bienvenue sur notre site d&apos;annonces !</h1>
      
      {error ? <ErrorComponent errorMessage={error} /> : 
      <>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher une annonce..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)} 
        />
        <button onClick={() => console.log('Rechercher')}>Rechercher</button>
      </div>

      

      <div className="announces-list">
        {filteredAnnounces.length === 0 ? (
          <p>Aucune annonce trouvée</p>
        ) : (
          filteredAnnounces.map((announce) => (
            <div key={announce._id} className="announce-item">
              <Link className="link-item" to={`/announce/${announce._id}`}>
                <h2>{announce.title}</h2>
                <p>{announce.categories.map((category) => category.title).join(', ')}</p>
                <p>{announce.description}</p>
                <p>Prix : {announce.price} €</p>
                <p>{announce.isSell ? 'Vendu' : 'Disponible'}</p>
                <p>Date de création : {new Date(announce.createdAt).toLocaleDateString()}</p>
              </Link>
              <button onClick={() => toggleFavorite(announce._id)}>
                <FontAwesomeIcon icon={announce.isFavorite ? heartSolid : heartRegular} style={{ color: announce.isFavorite ? 'red' : 'white' }} />
              </button>
            </div>
          ))
        )}

      </div>
      </>
      }
    </div>

  );
}

export default Home;