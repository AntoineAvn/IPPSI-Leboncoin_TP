// import React from 'react';
// import { useHistory } from 'react-router-dom';

const Logout = () => {
    // const history = useHistory();

    const handleLogout = () => {
        // Erase authToken form localStorage
        localStorage.removeItem('authToken');

        // Redirect to the '/' route
        window.location.replace('/');
    };

    return (
        <button onClick={handleLogout}>Se déconnecter</button>
    );
};

export default Logout;