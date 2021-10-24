import { Layer, PersonaSize, Text } from "@fluentui/react";
import { useContext } from "react";
import logo from "../../assets/img/logo.png";
import { UserContext } from "../../lib/GlobalProvider";
import ReportProblem from "../ReportProblem";
import UserPersona from "../UserPersona";
import styles from "./style";

const NavBar = ({ layerHostId }) => {
  let { header, img, logoContainer } = styles;

  const { currentUser } = useContext(UserContext);

  const isC3 = currentUser.userRolesByUserIdList.some(
    (v) => v.roleByRoleId.code === "C3"
  );

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
        {!isC3 && <ReportProblem />}
        <UserPersona
          size={PersonaSize.size32}
          name={currentUser.firstName + " " + currentUser.lastName}
        />
      </div>
    </header>
  );

  return <Layer hostId={layerHostId}>{content}</Layer>;
};

export default NavBar;
