import { Persona } from "@fluentui/react";

const UserPersona = ({ size, name }) => {
  return (
    <Persona
      text={name}
      size={size}
    />
  );
};

export default UserPersona;
