import {
  ActivityItem,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  Text,
} from "@fluentui/react";
import Attachment from "../Attachment";
import styles from "./style";

const PreviewPopup = ({ hidePreview, onCancel, data }) => {
  const {
    title,
    description,
    userAccountByCreatedBy: { firstName, lastName },
    createdAt,
  } = data;

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
      <Attachment />
      <ActivityItem {...activityItemProps} className={styles.exampleRoot} />
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onCancel} />
      </DialogFooter>
    </Dialog>
  );
};

export default PreviewPopup;
