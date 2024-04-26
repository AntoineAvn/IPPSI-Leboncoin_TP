import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Pour accéder au paramètre d'URL
import ErrorComponent from '../../components/error/ErrorComponent';
// import './Announce.css';

function Announce() {
  const { id } = useParams(); // Récupère l'identifiant de l'URL
  const [announce, setAnnounce] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/announce/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error(`Erreur: ${response.status} - ${response.statusText}`);
      })
      .then((data) => {
        setAnnounce(data.value.annonce);
        setIsLoading(false);
      })
      .catch((err) => {
        setError('Impossible de récupérer les détails de l\'annonce');
        console.error(err);
        setIsLoading(false);
      });
  }, [id]); // Dépend du paramètre id, pour recharger si l'id change

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <div className="announce-detail">
    {error ? <ErrorComponent errorMessage={error} /> : 
      <>
      <h1>{announce.title}</h1>
      <p>Description : {announce.description}</p>
      <p>Prix : {announce.price} €</p>
      <p>{announce.isSell ? 'Vendu' : 'Disponible'}</p>
      <p>Date de création : {new Date(announce.createdAt).toLocaleDateString()}</p>
      {/* Ajoutez d'autres détails ici */}
      </>
    }
    </div>
  );
}

export default Announce;
