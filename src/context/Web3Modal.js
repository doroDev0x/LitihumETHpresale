import { createWeb3Modal } from '@web3modal/wagmi/react';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const projectId = 'bcf6660cebd5b5cefe37e05961e5e9f9'; // Cambia por tu propio Project ID de WalletConnect.

const metadata = {
  name: 'Prestak',
  description: 'Prestak',
  url: 'https://web3modal.com', // Asegúrate de cambiar esto por tu URL real
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// Configurar los conectores para MetaMask y TrustWallet
const connectors = [
  // Conector para MetaMask
  injected({
    name: "MetaMask",
    shimDisconnect: true, // Recuerda si el usuario desconectó
  }),
  // Conector para TrustWallet usando WalletConnect
  walletConnect({
    projectId, // Tu Project ID de WalletConnect
    metadata,
    showQrModal: true, // Muestra el QR para TrustWallet
  }),
];

const config = createConfig({
  chains: [bsc],
  transports: {
    [bsc.id]: http(),
  },
  connectors,
});

// Crear el Web3Modal con los conectores configurados
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
