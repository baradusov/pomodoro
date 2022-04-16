import { useEffect } from 'react';
import { StoreProvider } from 'lib/context/storeContext';
import { RootStore } from 'lib/store/rootStore';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const store = new RootStore();

  useEffect(() => {
    store.init();
  }, []);

  return (
    <StoreProvider store={store}>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default MyApp;
