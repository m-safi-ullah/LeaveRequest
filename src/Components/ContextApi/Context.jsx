import React, { createContext, useContext, useState } from "react";

const DataContext = createContext({});

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <DataContext.Provider
      value={{
        token,
        setToken,
        role,
        setRole,
        userName,
        setUserName,
        email,
        setEmail,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
