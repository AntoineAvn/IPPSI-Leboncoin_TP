import './ErrorComponent.css';
import PropTypes from 'prop-types';

const ErrorComponent = ({ errorMessage }) => {
  if (!errorMessage) {
    return null; // Si aucun message d'erreur, ne rien afficher
  }

  return (
    <div className="error-message">
      {errorMessage}
    </div>
  );
};

// Rendre le prop optionnel
ErrorComponent.propTypes = {
  errorMessage: PropTypes.string,
};

// Valeur par défaut comme chaîne vide pour éviter les avertissements de prop-type
ErrorComponent.defaultProps = {
  errorMessage: '',
};

export default ErrorComponent;
