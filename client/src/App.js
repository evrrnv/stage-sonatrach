import './App.css'
import { useKeycloak } from "@react-keycloak/web";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import SideBar from "./components/SideBar";
import NavBar from "./components/NavBar";
import { LayerHost } from "@fluentui/react";
import Home from "./pages/Home";
import GlobalProvider from "./lib/GlobalProvider";

const App = () => {
  const { keycloak } = useKeycloak();

  const layerHostId = "layerHost";

  if (keycloak.authenticated) {
    return (
      <GlobalProvider>
        <div className="App">
          <BrowserRouter>
            <LayerHost id={layerHostId} />
            <NavBar layerHostId={layerHostId} />
            <div style={{ display: "flex", flexGrow: 1 }}>
              <SideBar />
              <Switch>
                <Route path="/" exact component={Home} />
              </Switch>
            </div>
          </BrowserRouter>
        </div>
      </GlobalProvider>
    );
  } else {
    keycloak.login();
    return null;
  }
};

export default App;
