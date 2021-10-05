import { Nav } from "@fluentui/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./style";

const SideBar = () => {
  const [selected, setSelected] = useState(1);

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
    history.push(item.url);
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
