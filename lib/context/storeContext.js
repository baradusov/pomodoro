import { createContext } from 'react';

import { RootStore } from 'lib/store/rootStore';

export const StoreContext = createContext(new RootStore());

export const StoreProvider = ({ children, store }) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
