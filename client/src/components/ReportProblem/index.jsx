import {
  ActionButton,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  TextField,
  FontIcon,
  Link
} from "@fluentui/react";
import React, { useState } from "react";
import getClassNames from './style'

const ProblemForm = () => {
  const [hideDialog, setHideDialog] = useState(true);

  const { link, li, closeIcon } = getClassNames()

  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: "Rapporter un problème",
    subText: "Cras condimentum consectetur mollis vivamus nisi ipsum finibus.",
  };

  const modelProps = {
    isBlocking: false,
  };

  const toggleHideDialog = () => {
    setHideDialog(!hideDialog)
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
        minWidth={"35rem"}
      >
        <form>
          <TextField label="Title" />
          <TextField label="Description" multiline rows={5} />
          <ActionButton iconProps={{ iconName: "Attach" }}>
            pièce jointe
          </ActionButton>

          <ul style={{
            padding: "9px 13px 0px",
            listStyleType: "none",
            margin: "0px",
            display: "flex",
            flexDirection: "column",   
          }}>
            <li className={li}>
              <FontIcon aria-label="TextDocument" iconName="TextDocument" />
              <Link className={link} href="">file-1.txt</Link>
              <FontIcon className={closeIcon} aria-label="StatusCircleErrorX" iconName="StatusCircleErrorX" />
            </li>
            <li className={li}>
              <FontIcon aria-label="TextDocument" iconName="TextDocument" />
              <Link className={link} href="">file-2.txt</Link>
              <FontIcon className={closeIcon} aria-label="StatusCircleErrorX" iconName="StatusCircleErrorX" />
            </li>
          </ul>
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
