import React, { createContext, useContext, useState } from 'react';

const GroupsContext = createContext<any>(null);

export const GroupsProvider= ({ children }:any) => {
  const [groupsData, setGroupsData] = useState<string[]>([]);

  return (
    <GroupsContext.Provider value={{ groupsData, setGroupsData }}>
      {children}
    </GroupsContext.Provider>
  );
};

export const useGroupsContext = () => useContext(GroupsContext);
