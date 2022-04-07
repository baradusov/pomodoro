import '../styles/globals.css';

import { StoreProvider } from 'lib/context/storeContext';
import { RootStore } from 'lib/store/rootStore';

function MyApp({ Component, pageProps }) {
  const store = new RootStore();

  return (
    <StoreProvider store={store}>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default MyApp;
