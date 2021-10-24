import { useMutation } from "@apollo/client";
import {
  ActionButton,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  TextField,
} from "@fluentui/react";
import React, { useState } from "react";
import CREATE_PROBLEM from "../../graphql/mutations/CREATE_PROBLEM";
import GET_PROBLEMS from "../../graphql/queries/GET_PROBLEMS";
import { defaultFilterVars } from "../../pages/Home";
import Attachment from "../Attachment";

const ProblemForm = () => {
  const [hideDialog, setHideDialog] = useState(true);

  const toggleHideDialog = () => {
    setHideDialog(!hideDialog);
  };

  const [title, setTitle] = useState();
  const [description, setDescription] = useState();

  const [createProblem, { loading }] = useMutation(
    CREATE_PROBLEM,
    {
      onCompleted: () => {
        setTitle("");
        setDescription("");
        toggleHideDialog();
      },
      update: (cache, { data: dataToUpdate }) => {
        const existingCache = cache.readQuery({
          query: GET_PROBLEMS,
          variables: defaultFilterVars
        });

        const newData = JSON.parse(JSON.stringify(existingCache));

        newData.allProblems.nodes.unshift(dataToUpdate.createProblem.problem);

        cache.writeQuery({
          query: GET_PROBLEMS,
          data: newData,
          variables: defaultFilterVars
        });
      },
    }
  );

  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: "Rapporter un problème",
    subText: "Cras condimentum consectetur mollis vivamus nisi ipsum finibus.",
  };

  const modelProps = {
    isBlocking: false,
  };

  const onChangeTitleValue = (_, newValue) => {
    setTitle(newValue);
  };

  const onChangeDescriptionValue = (_, newValue) => {
    setDescription(newValue);
  };

  const onSave = () => {
    createProblem({
      variables: {
        title,
        description,
      },
    });
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
          <TextField
            label="Title"
            value={title}
            onChange={onChangeTitleValue}
          />
          <TextField
            label="Description"
            multiline
            rows={5}
            value={description}
            onChange={onChangeDescriptionValue}
          />
          <ActionButton iconProps={{ iconName: "Attach" }}>
            pièce jointe
          </ActionButton>

          <Attachment />
        </form>
        <DialogFooter>
          <DefaultButton onClick={toggleHideDialog} text="Cancel" />
          <PrimaryButton onClick={onSave}>
            {loading ? <Spinner size={SpinnerSize.xSmall} /> : "Save"}
          </PrimaryButton>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ProblemForm;
