import React, { createContext, useContext, useState } from 'react';

const DontUseContext = createContext<any>(null);

export const DontUseProvider= ({ children }:any) => {
  const [name, setName] = useState<string>("");

  return (
    <DontUseContext.Provider value={{ name, setName }}>
      {children}
    </DontUseContext.Provider>
  );
};

export const useDontUseContext = () => useContext(DontUseContext);