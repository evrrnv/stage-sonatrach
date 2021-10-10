import { Layer, PersonaSize, Text } from "@fluentui/react";
import logo from "../../assets/img/logo.png";
import ReportProblem from "../ReportProblem";
import UserPersona from "../UserPersona";
import getClassNames from "./style";

const NavBar = ({ layerHostId }) => {
  let { header, img, logoContainer } = getClassNames();

  const content = (
    <header className={header}>
      <div className={logoContainer}>
        <img className={img} src={logo} alt="logo" />
        <Text variant="large">Centre d'aide</Text>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          marginRight: "1.5rem",
        }}
      >
        <ReportProblem />
        <UserPersona size={PersonaSize.size32} name={"Abdelmounaim Bousmat"} />
      </div>
    </header>
  );

  return <Layer hostId={layerHostId}>{content}</Layer>;
};

export default NavBar;
