import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext<any>(null);

export const UserProvider= ({ children }:any) => {
  const [user, setUser] = useState<string>("");

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
