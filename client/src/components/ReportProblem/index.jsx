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
import React, { createRef, useState } from "react";
import CREATE_PROBLEM from "../../graphql/mutations/CREATE_PROBLEM";
import GET_PROBLEMS from "../../graphql/queries/GET_PROBLEMS";
import { defaultFilterVars } from "../../pages/Home";
import Attachment from "../Attachment";
import { attachmentButtonStyle, inputStyle } from "./style";

const uploadAttachments = (files, problemId) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        resolve(JSON.parse(xhr.responseText));
      }
    };
    xhr.open("POST", "http://localhost:4000/upload-attachments");

    const formData = new FormData();
    formData.append("id", problemId);
    for (var i = 0; i < files.length; i++) {
      formData.append("file-" + i, files[i]);
    }
    xhr.send(formData);
  });
};

const ProblemForm = () => {
  const [hideDialog, setHideDialog] = useState(true);

  const clearData = () => {
    setTitle();
    setDescription();
    setFiles();
  }

  const toggleHideDialog = () => {
    setHideDialog(!hideDialog);
    clearData()
  };

  const [title, setTitle] = useState();
  const [description, setDescription] = useState();

  const [titleError, setTitleError] = useState();
  const [descriptionError, setDescriptionError] = useState();

  const [files, setFiles] = useState();

  const uploadRef = createRef();

  const [createProblem, { loading, error }] = useMutation(CREATE_PROBLEM, {
    onCompleted: () => {
      toggleHideDialog();
    },
    update: async (cache, { data: dataToUpdate }) => {
      let data;
      if (files != null) {
        data = await uploadAttachments(
          files,
          dataToUpdate.createProblem.problem.id
        );
      }

      const existingCache = cache.readQuery({
        query: GET_PROBLEMS,
        variables: defaultFilterVars,
      });

      const newData = JSON.parse(JSON.stringify(existingCache));
      const newDataToUpdate = JSON.parse(JSON.stringify(dataToUpdate));

      if (files != null) {
        newDataToUpdate.createProblem.problem.attachmentsByProblemId.nodes =
          data;
      }

      newData.allProblems.nodes.unshift(newDataToUpdate.createProblem.problem);

      cache.writeQuery({
        query: GET_PROBLEMS,
        data: newData,
        variables: defaultFilterVars,
      });
    },
  });

  if (error) {
    console.log(error);
  }

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
    if (title) {
      if (title.length < 30) {
        setTitleError("La longueur minimale des caractères est 30");
      } else {
        setTitleError();
      }
    } else {
      setTitleError("Le titre est vide ");
    }

    if (description) {
      if (description.length < 50) {
        setDescriptionError("La longueur minimale des caractères est 50");
      } else {
        setDescriptionError();
      }
    } else {
      setDescriptionError("La description est vide ");
    }

    if (title && description) {
      if (title.length >= 30 && description.length >= 50) {
        createProblem({
          variables: {
            title,
            description,
          },
        });
      }
    }
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
            required
            errorMessage={titleError}
            styles={inputStyle}
          />
          <TextField
            label="Description"
            multiline
            rows={5}
            value={description}
            onChange={onChangeDescriptionValue}
            required
            errorMessage={descriptionError}
            styles={inputStyle}
          />
          <div>
            <ActionButton
              onClick={() => {
                uploadRef.current.click();
              }}
              iconProps={{ iconName: "Attach" }}
              styles={attachmentButtonStyle}
            >
              pièce jointe
            </ActionButton>

            <input
              type="file"
              accept="image/*"
              required
              multiple
              hidden
              ref={uploadRef}
              onChange={({ target: { validity, files } }) => {
                if (validity.valid) {
                  setFiles(Array.from(files));
                }
              }}
            />
          </div>
          <Attachment
            files={files}
            onDelete={(event) => {
              const clickedFile = parseInt(
                event.currentTarget.attributes[0].nodeValue
              );
              files.splice(clickedFile, 1);
              setFiles([...files]);
            }}
            remove
          />
          <DialogFooter>
            <DefaultButton onClick={toggleHideDialog} text="Cancel" />
            <PrimaryButton onClick={onSave}>
              {loading ? <Spinner size={SpinnerSize.xSmall} /> : "Save"}
            </PrimaryButton>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default ProblemForm;
