import React from "react";
import ReactDOM from "react-dom";
import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web";
import { initializeIcons } from "@fluentui/react";
import "./index.css";
import App from "./App";
import keycloak from "./lib/keycloak";
import Loading from "./components/Loading";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

initializeIcons();

const cache = new InMemoryCache({
  dataIdFromObject: (object) => object.nodeId || null,
});

const Apollo = ({ children }) => {
  const { keycloak } = useKeycloak();

  const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "same-origin",
  });
  const authLink = setContext((_, { headers }) => {
    const token = keycloak.token;
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

ReactDOM.render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: "check-sso",
      silentCheckSsoRedirectUri:
        window.location.origin + "/silent-check-sso.html",
    }}
    LoadingComponent={<Loading />}
  >
    <React.StrictMode>
      <Apollo>
        <App />
      </Apollo>
    </React.StrictMode>
  </ReactKeycloakProvider>,
  document.getElementById("root")
);
