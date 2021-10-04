import './App.css';
import { useKeycloak } from '@react-keycloak/web';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import SideBar from './components/SideBar';

const Home = () => (<div>Home</div>)
const History = () => (<div>History</div>)

const App = () => {
  const { keycloak } = useKeycloak()

  if (keycloak.authenticated) {
    return (
      <div className="App">
        <BrowserRouter>
          <SideBar />
      
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/history' component={History} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  } else {
    keycloak.login()
    return null
  }
}

export default App;
