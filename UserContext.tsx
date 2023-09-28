import React, { createContext, useContext, useState } from 'react';
import { UsersModel } from './src/types/types';

const UserContext = createContext<any>(null);

export const UserProvider= ({ children }:any) => {
  const [user, setUser] = useState<UsersModel|null|undefined>();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
