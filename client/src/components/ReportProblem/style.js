import { getTheme, mergeStyleSets } from "@fluentui/react";

const theme = getTheme();

export const inputStyle = { field: { color: theme.palette.neutralSecondary } };

export const attachmentButtonStyle = {
  root: { color: theme.palette.neutralSecondary },
};
