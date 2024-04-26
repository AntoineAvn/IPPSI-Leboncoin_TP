import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Favoris.css';
import ErrorComponent from '../../components/error/ErrorComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as heartRegular, faHeart as heartSolid } from '@fortawesome/free-regular-svg-icons';

function Favoris() {
  const [favoriteAnnounces, setFavoriteAnnounces] = useState([]);
  // const [announces, setAnnounces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const favoriteData = data.value.annonces.filter(announce => favorites.includes(announce._id));
        setFavoriteAnnounces(favoriteData);
        setIsLoading(false);
      })
      .catch((err) => {
        setError('Impossible de récupérer les annonces favorites');
        console.error(err);
        setIsLoading(false);
      });
  }, [userId]); 

  const toggleFavorite = (id) => {
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
    const isFavorite = favorites.includes(id);
    const updatedFavorites = isFavorite 
      ? favorites.filter(favId => favId !== id) 
      : [...favorites, id];

    // Mettre à jour le localStorage
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));

    // Mettre à jour l'état des favoris
    const updatedFavoritesData = favoriteAnnounces.map(announce => 
      announce._id === id ? { ...announce, isFavorite: !announce.isFavorite } : announce
    );

    setFavoriteAnnounces(isFavorite ? updatedFavoritesData.filter(a => a._id !== id) : updatedFavoritesData);
  };

  if (isLoading) {
    return <div>Chargement des annonces favorites...</div>;
  }

  return (
    <div className="favoris-container">
      <h1>Mes annonces favorites</h1>
      
      {error ? <ErrorComponent errorMessage={error} /> :
      <div className="favorite-announces-list">
        {favoriteAnnounces.length === 0 ? (
            <p>Vous n&apos;avez pas de favoris pour le moment.</p>
        ) : (
            favoriteAnnounces.map((announce) => (
                <div key={announce._id} className="favorite-announce-item">
                    <Link to={`/announce/${announce._id}`}>
                        <h2>{announce.title}</h2>
                        <p>{announce.description}</p>
                        <p>Prix : {announce.price} €</p>
                        <p>{announce.isSell ? 'Vendu' : 'Disponible'}</p>
                        <p>Date de création : {new Date(announce.createdAt).toLocaleDateString()}</p>
                    </Link>
                    <button onClick={() => toggleFavorite(announce._id)}>
                      <FontAwesomeIcon icon={announce.isFavorite ? heartSolid : heartRegular} style={{ color: 'red' }} />
                    </button>
                </div>
            ))
        )}
      </div>
      }
    </div>
  );
}

export default Favoris;
