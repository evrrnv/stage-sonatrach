import {
  ActivityItem,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  Text,
} from "@fluentui/react";
import Attachment from "../Attachment";
import styles from './style'

const PreviewPopup = ({ hidePreview, onCancel }) => {
  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: "Nullam dapibus nunc tempus elit vehicula iaculis",
    subText:
      "Sed non elementum sem. Vestibulum mauris nisl, tincidunt in placerat in, lacinia in lectus. Nullam mattis malesuada purus a fringilla. Donec porttitor nibh quis justo sagittis, at porta purus euismod. Pellentesque leo metus, posuere vel mattis eu, suscipit ut est. Donec accumsan finibus dui, sed facilisis dui fringilla ut. Integer volutpat facilisis dignissim. Ut posuere nibh et tellus auctor, vitae tempor diam elementum. Nam varius vel nulla eget semper. Vestibulum pretium porttitor mi in luctus. Donec vitae feugiat massa, tincidunt convallis ipsum. Donec vitae faucibus mi. Nulla facilisi. Nulla dapibus maximus urna ut sollicitudin. Aliquam posuere tortor sed nisl viverra, egestas tempor diam bibendum. Nunc consequat imperdiet nibh interdum commodo. ",
  };

  const activityItemProps = {
    key: 3,
    activityDescription: [
      <span key={1} className={styles.nameText}>
        Sabrina De Luca
      </span>,
      <span key={2}> a signalé ce problème</span>,
    ],
    activityPersonas: [{ imageUrl: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" }],
    isCompact: true,
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
