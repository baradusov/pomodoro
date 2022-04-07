import { useContext } from 'react';

import { StoreContext } from 'lib/context/storeContext';

export const useStore = () => useContext(StoreContext);
