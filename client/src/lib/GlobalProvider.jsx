import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import Loading from "../components/Loading";
import GET_CURRENT_USER from "../graphql/queries/GET_CURRENT_USER";

export const UserContext = React.createContext();

const GlobalProvider = ({ children }) => {
  const progressState = useState(false);
  const { loading, error, data } = useQuery(GET_CURRENT_USER);

  if (loading) return <Loading />;
  if (error) return `Error! ${error.message}`;

  const { currentUser } = data;

  return (
    <UserContext.Provider
      value={{
        currentUser,
        progressState,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default GlobalProvider;
