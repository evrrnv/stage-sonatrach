import { getTheme, mergeStyleSets } from "@fluentui/react";

const theme = getTheme();

const getClassNames = () => {

  return mergeStyleSets({
    link: {
      color: theme.palette.neutralDark,
      margin: "0.5rem",
      ":focus": {
        color: theme.palette.neutralDark,
      }
    },
    li: {
      height: "1rem",
      lineHeight: "1rem",
      display: "flex",
      flexWrap: "nowrap",
      alignItems: "center",
      marginBottom: "8px",
      overflow: "hidden", 
    },
    closeIcon: {
        cursor: "pointer"
    }
  });
};

export default getClassNames;
