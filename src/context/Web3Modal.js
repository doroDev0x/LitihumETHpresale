import { createWeb3Modal } from '@web3modal/wagmi/react';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const projectId = 'bcf6660cebd5b5cefe37e05961e5e9f9';

const metadata = {
  name: 'Prestak',
  description: 'Prestak',
  url: 'https://web3modal.com', // Asegúrate de cambiar esto por tu URL real
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// Crear solo el conector de WalletConnect con showQrModal en fa
let connectors = []
connectors.push(walletConnect({ projectId, metadata, showQrModal: false })) // showQrModal must be false

const config = createConfig({
  chains: [bsc],
  transports: {
    [bsc.id]: http()
  },
  connectors
})

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
