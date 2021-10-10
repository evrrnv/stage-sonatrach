import {
  DetailsList,
  MarqueeSelection,
  SelectionMode,
  Stack,
  CommandBarButton,
  Selection,
  PersonaSize,
  TextField,
} from "@fluentui/react";
import { useEffect, useState } from "react";
import PreviewPopup from "../../components/PreviewPopup";
import UserPersona from "../../components/UserPersona";
import {
  detailsList,
  eyeIcon,
  headStack,
  homeStack,
  marqueeSelection,
} from "./style";

const Home = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [disabledButton, setDisabledButton] = useState();
  const [previewHidden, setPreviewHidden] = useState(true);

  const moreProps = {
    items: [
      {
        key: 1,
        text: "Supprimer",
        iconProps: { iconName: "Delete" },
      },
    ],
  };

  const editProps = {
    items: [
      {
        key: 1,
        text: "En attente",
        iconProps: { iconName: "Clock" },
      },
      {
        key: 2,
        text: "En Traitement",
        iconProps: { iconName: "Processing" },
      },
      {
        key: 3,
        text: "Traité",
        iconProps: { iconName: "Accept" },
      },
      {
        key: 4,
        text: "Non traitable ",
        iconProps: { iconName: "Warning" },
      },
    ],
  };

  useEffect(() => {
    if (isSelected) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [isSelected]);

  const selection = new Selection({
    onSelectionChanged: () => {
      const selectedItem = selection.getSelection()[0];

      if (selectedItem) {
        setIsSelected(true);
      } else {
        setIsSelected(false);
      }
    },
  });

  const onRenderRow = ({ Utilisateur }) => {
    return <UserPersona size={PersonaSize.size24} name={Utilisateur} />;
  };

  const handleClickPreview = () => setPreviewHidden(false);

  const handlePreviewCancel = () => setPreviewHidden(true);

  return (
    <Stack styles={homeStack}>
      <Stack horizontal horizontalAlign="space-between" styles={headStack}>
        <Stack horizontal style={{height: "44px"}}>
          <CommandBarButton
            styles={eyeIcon}
            iconProps={{ iconName: "RedEye" }}
            text="Aperçu"
            disabled={disabledButton}
            onClick={handleClickPreview}
          />
          <CommandBarButton
            iconProps={{ iconName: "Edit" }}
            text="Modifier l'État"
            disabled={disabledButton}
            menuProps={editProps}
          />
          <CommandBarButton
            menuProps={moreProps}
            text="Plus"
            disabled={disabledButton}
          />
        </Stack>
        <TextField style={{width: "250px"}} placeholder="Filtrer par utilisateur" />
      </Stack>
      <MarqueeSelection isEnabled={false} styles={marqueeSelection}>
        <DetailsList
          styles={detailsList}
          items={data}
          selectionMode={SelectionMode.single}
          setKey="exampleList"
          columns={[
            {
              key: 1,
              name: "Titre",
              fieldName: "Titre",
              minWidth: 200,
            },
            {
              key: 2,
              name: "Utilisateur",
              fieldName: "Utilisateur",
              minWidth: 300,
              onRender: onRenderRow,
            },
            {
              key: 3,
              name: "Date",
              fieldName: "Date",
              minWidth: 200,
            },
            {
              key: 4,
              name: "État",
              fieldName: "État",
              minWidth: 200,
            },
            {
              key: 5,
              name: "Pièces jointes",
              fieldName: "Pièces jointes",
              minWidth: 200,
            },
          ]}
          selection={selection}
        />
      </MarqueeSelection>
      <PreviewPopup
        hidePreview={previewHidden}
        onCancel={handlePreviewCancel}
      />
    </Stack>
  );
};

const data = [
  {
    id: 1,
    Titre: "Nullam dapibus nunc tempus elit vehicula iaculis.",
    Date: "9/02/2021",
    État: "En attente",
    Utilisateur: "Abdelmounaim Bousmat",
    "Pièces jointes": 1,
  },
  {
    id: 2,
    Titre: "Nullam dapibus nunc tempus elit vehicula iaculis.",
    Date: "01/01/2021",
    État: "En attente",
    Utilisateur: "Reda  Makhloufi",
    "Pièces jointes": 0,
  },
  {
    id: 3,
    Titre: "Nullam dapibus nunc tempus elit vehicula iaculis.",
    Date: "15/12/2020",
    État: "En attente",
    Utilisateur: "Jassem Hamina",
    "Pièces jointes": 2,
  },
];

export default Home;
