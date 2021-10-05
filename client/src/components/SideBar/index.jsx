import { Nav } from '@fluentui/react'
import { useState } from 'react';
import { useHistory } from "react-router-dom"
import styles from './style'

const SideBar = () => {

    const [selected, setSelected] = useState(1)

    let history = useHistory();

    const navLinkGroups = [
      {
        name: "",
        links: [
          {
            name: 'Accueil',
            key: 1,
            icon: "Home",
            url: '/'
          },
          {
            name: 'History',
            key: 2,
            icon: "History",
            url: '/history'
          },
          {
            name: 'Logout',
            key: 3
          },
        ],
      } 
    ];
    
    const onLinkClick = (e, item) => {
      e.preventDefault()
      setSelected(item.key)
      history.push(item.url);
    }
  
    return (
      <Nav groups={navLinkGroups} styles={styles} selectedKey={selected} onLinkClick={onLinkClick} />
    )
    
  }

export default SideBar