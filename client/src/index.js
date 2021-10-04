import React from 'react';
import ReactDOM from 'react-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web'
import './index.css';
import App from './App';
import keycloak from './lib/keycloak'

const Loading = () => (<div>loading...</div>)

ReactDOM.render(
  <ReactKeycloakProvider 
    authClient={keycloak}
    initOptions={{ 
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    }}
    LoadingComponent={<Loading />}
    >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ReactKeycloakProvider>,
  document.getElementById('root')
);

