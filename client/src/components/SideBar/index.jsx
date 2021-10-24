import { Nav } from "@fluentui/react";
import { useKeycloak } from "@react-keycloak/web";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./style";

const SideBar = () => {
  const [selected, setSelected] = useState(1);
  const { keycloak } = useKeycloak();
  let history = useHistory();

  const navLinkGroups = [
    {
      name: "",
      links: [
        {
          name: "Historique",
          key: 1,
          icon: "History",
          url: "/",
        },
        {
          name: "Se déconnecter",
          key: 2
        },
      ],
    },
  ];

  const onLinkClick = (e, item) => {
    e.preventDefault();
    setSelected(item.key);
    if (item.key !== 2) {
      history.push(item.url);
    } else {
      keycloak.logout()
    }
  };

  return (
    <Nav
      groups={navLinkGroups}
      styles={styles}
      selectedKey={selected}
      onLinkClick={onLinkClick}
    />
  );
};

export default SideBar;
