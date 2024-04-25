import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Bienvenue sur notre site d'annonces !</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher une annonce..."
        />
        <button>Rechercher</button>
      </div>
    </div>
  );
}

export default Home;