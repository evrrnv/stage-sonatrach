import { Persona } from "@fluentui/react";

const UserPersona = ({ size, name, initialsColor }) => {
  return (
    <Persona
      text={name}
      size={size}
      initialsColor={initialsColor}
    />
  );
};

export default UserPersona;
