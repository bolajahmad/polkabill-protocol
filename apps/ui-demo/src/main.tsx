import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import App from './App.tsx';
import { RootContext } from './context/RootContext.tsx';
import './index.css';
import { getConfig } from './wallet/wagmi.ts';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={getConfig()}>
      <QueryClientProvider client={queryClient}>
        <RootContext>
          <App />
        </RootContext>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
