import { Spinner, SpinnerSize } from "@fluentui/react";

const Loading = () => (
  <Spinner styles={{root: {position: "fixed", width: "100%"}}} size={SpinnerSize.large} label="Loading account" />
);

export default Loading;
