import './App.css';
import { useKeycloak } from '@react-keycloak/web';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import SideBar from './components/SideBar';
import NavBar from './components/NavBar';
import { LayerHost, Text } from '@fluentui/react';

const Home = () => (<Text>Home</Text>)
const History = () => (<Text>History</Text>)

const App = () => {
  const { keycloak } = useKeycloak()

  const layerHostId = 'layerHost'

  if (keycloak.authenticated) {
    return (
      <div className="App">
        <BrowserRouter>
          <LayerHost id={layerHostId} />
          <NavBar layerHostId={layerHostId} />
          <div style={{ display: 'flex', flexGrow: 1}}>
            <SideBar />
            <Switch>
              <Route path='/' exact component={Home} />
              <Route path='/history' component={History} />
            </Switch>
          </div>

        </BrowserRouter>
      </div>
    )
  } else {
    keycloak.login()
    return null
  }
}

export default App;
