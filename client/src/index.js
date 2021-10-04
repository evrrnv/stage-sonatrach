import React from 'react';
import ReactDOM from 'react-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web'
import { initializeIcons } from "@fluentui/react";
import './index.css';
import App from './App';
import keycloak from './lib/keycloak'
import Loading from './components/Loading';

initializeIcons();

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

