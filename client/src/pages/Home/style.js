import { mergeStyleSets } from "@fluentui/react";

const getClassNames = () => {
  return mergeStyleSets({
    container: {
      width: "100%"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      width: "40rem",
      gap: "0.8rem"
    },
    formContainer: {
      display: "flex",
      justifyContent: "center"
    }
  });
};

export default getClassNames;
