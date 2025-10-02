import { useUser } from "@clerk/clerk-expo";
import React, { createContext, useContext, useEffect, useState } from "react";

const MechanicContext = createContext();

export const useMechanic = () => useContext(MechanicContext);

export const MechanicProvider = ({ children }) => {
  const { user } = useUser();

  const [mechanic, setMechanic] = useState(null);

  useEffect(() => {
    console.log("context provider Loaded... ");
  }, [mechanic, user]);

  return (
    <MechanicContext.Provider value={{ mechanic, setMechanic }}>
      {children}
    </MechanicContext.Provider>
  );
};
