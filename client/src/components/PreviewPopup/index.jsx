import {
  ActivityItem,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IconButton,
  Modal,
  Text,
  Image,
  ImageFit
} from "@fluentui/react";
import { useState } from "react";
import Attachment from "../Attachment";
import styles from "./style";

const PreviewPopup = ({ hidePreview, onCancel, data }) => {
  const {
    title,
    description,
    userAccountByCreatedBy: { firstName, lastName },
    createdAt,
    attachmentsByProblemId
  } = data;

  const [showModal, setShowModel] = useState(false);
  const [attachmentImage, setAttachmentImage] = useState()

  const hideModal = () => {
    setShowModel(!showModal);
  };

  const dialogContentProps = {
    type: DialogType.largeHeader,
    title,
    subText: description,
  };

  const fullName = firstName + " " + lastName;

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  function titleCase(str) {
    var splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  }

  const activityItemProps = {
    key: 3,
    activityDescription: [
      <span key={1} className={styles.nameText}>
        {fullName}
      </span>,
      <span key={2}> a rapporté ce problème</span>,
    ],
    activityPersonas: [
      {
        imageInitials: firstName.charAt(0) + lastName.charAt(0),
      },
    ],
    timeStamp: titleCase(
      new Date(createdAt).toLocaleDateString("fr-FR", options)
    ),
  };

  return (
    <Dialog
      hidden={hidePreview}
      minWidth="35rem"
      dialogContentProps={dialogContentProps}
    >
      <div style={{ marginBottom: "0.5rem" }}>
        <Text variant="large">Pièce jointe</Text>
      </div>
      <Attachment files={attachmentsByProblemId.nodes} onClick={(e) => {
        setAttachmentImage("http://localhost:4000/attachments/" + e.target.innerText)
        hideModal()
      }} />
      <ActivityItem {...activityItemProps} className={styles.exampleRoot} />
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onCancel} />
      </DialogFooter>
      <Modal
            styles={{
              main: { backgroundColor: "#fff0", position: "relative" },
            }}
            isOpen={showModal}
            onDismiss={hideModal}
            isBlocking={false}
          >
            <IconButton
              styles={{
                root: { position: "absolute", right: 0, zIndex: 100 },
                rootHovered: { backgroundColor: "none" },
                rootPressed: { backgroundColor: "none" }
              }}
              iconProps={{ iconName: "Cancel" }}
              ariaLabel="Close popup modal"
              onClick={hideModal}
            />
            <Image
              src={attachmentImage}
              imageFit={ImageFit.cover}
              maximizeFrame={true}
              width={800}
            />
          </Modal>
    </Dialog>
  );
};

export default PreviewPopup;
