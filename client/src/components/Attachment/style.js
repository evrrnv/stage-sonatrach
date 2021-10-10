import { getTheme, mergeStyleSets } from "@fluentui/react";

const theme = getTheme();

const styles = mergeStyleSets({
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
  },
  ul: {
    padding: "9px 14px 0px",
    listStyleType: "none",
    margin: "0px",
    display: "flex",
    flexDirection: "column",
  }
});

export default styles;