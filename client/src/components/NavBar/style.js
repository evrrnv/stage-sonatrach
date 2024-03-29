import { mergeStyleSets } from "@fluentui/react";

const styles = mergeStyleSets({
  header: {
    borderBottom: "1px solid #eee",
    padding: "0.5rem 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  img: {
    width: "30px",
    height: "46px",
  },
  logoContainer: {
    width: "13.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
});

export default styles;
