import { useUser } from "@clerk/clerk-expo";
import React, { createContext, useContext, useEffect, useState } from "react";

const MechanicContext = createContext();

export const useMechanic = () => useContext(MechanicContext);

export const MechanicProvider = ({ children }) => {
  const { user } = useUser();

  const [mechanic, setMechanic] = useState(null);
  const [mechisOnline, setMechIsOnline] = useState();

  useEffect(() => {
    console.log("context provider Loaded... ");
  }, [mechanic, user]);

  return (
    <MechanicContext.Provider
      value={{ mechanic, setMechanic, mechisOnline, setMechIsOnline }}
    >
      {children}
    </MechanicContext.Provider>
  );
};
