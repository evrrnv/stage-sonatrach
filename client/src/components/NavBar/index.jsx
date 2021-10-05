import { Layer, Text } from "@fluentui/react"
import logo from '../../assets/img/logo.png'
import UserPersona from "../UserPersona";
import getClassNames from './style'

const NavBar = ({ layerHostId }) => {

  let { header, img, logoContainer } = getClassNames();

    const content = (
      <header className={header}>
        <div className={logoContainer}>
          <img className={img} src={logo} alt="logo" />
          <Text variant="large">Centre d'aide</Text>
        </div>
        <UserPersona />
      </header>
    );
    
    return (
        <Layer hostId={layerHostId}>
            {content}
        </Layer>
    )
}
  

export default NavBar