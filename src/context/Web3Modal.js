import { createWeb3Modal } from '@web3modal/wagmi/react';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const projectId = 'bcf6660cebd5b5cefe37e05961e5e9f9';

const metadata = {
  name: 'Prestak',
  description: 'Prestak',
  url: 'https://web3modal.com', // Asegúrate de cambiar esto por tu URL real
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// Configurar el conector Injected para MetaMask
let connectors = [];
connectors.push(
  injected({
    name: "MetaMask", // Personaliza el nombre que aparecerá
    shimDisconnect: true, // Recuerda el estado de conexión
  })
);

const config = createConfig({
  chains: [bsc],
  transports: {
    [bsc.id]: http(),
  },
  connectors,
});

// Crear el Web3Modal para usar con el conector configurado
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'dark',
  enableAnalytics: true,
  enableOnramp: true,
});

export function Web3ModalProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
