import './LogoutComponent.css';

const Logout = () => {

    const handleLogout = () => {
        // Erase authToken form localStorage
        localStorage.removeItem('authToken');

        // Redirect to the '/' route
        window.location.replace('/');
    };

    return (
        <button id='bnt-logout' onClick={handleLogout}>Se déconnecter</button>
    );
};

export default Logout;