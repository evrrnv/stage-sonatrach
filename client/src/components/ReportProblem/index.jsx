import {
  ActionButton,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  TextField,
} from "@fluentui/react";
import React, { useState } from "react";
import Attachment from "../Attachment";

const ProblemForm = () => {
  const [hideDialog, setHideDialog] = useState(true);

  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: "Rapporter un problème",
    subText: "Cras condimentum consectetur mollis vivamus nisi ipsum finibus.",
  };

  const modelProps = {
    isBlocking: false,
  };

  const toggleHideDialog = () => {
    setHideDialog(!hideDialog);
  };

  return (
    <div>
      <DefaultButton iconProps={{ iconName: "Add" }} onClick={toggleHideDialog}>
        Rapporter un Problème
      </DefaultButton>
      <Dialog
        hidden={hideDialog}
        dialogContentProps={dialogContentProps}
        modelProps={modelProps}
        minWidth="35rem"
      >
        <form>
          <TextField label="Title" />
          <TextField label="Description" multiline rows={5} />
          <ActionButton iconProps={{ iconName: "Attach" }}>
            pièce jointe
          </ActionButton>

          <Attachment />
        </form>
        <DialogFooter>
          <PrimaryButton text="Save" />
          <DefaultButton onClick={toggleHideDialog} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ProblemForm;
