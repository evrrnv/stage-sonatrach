import './App.css';
import { useKeycloak } from '@react-keycloak/web';

function App() {
  const { keycloak } = useKeycloak()

  if (keycloak.authenticated) {
    return (
      <div className="App">
        Sonatrach
      </div>
    )
  } else {
    keycloak.login()
    return null
  }
}

export default App;
