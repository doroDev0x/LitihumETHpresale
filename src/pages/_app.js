import { ChakraProvider } from "@chakra-ui/react";
import { Web3ModalProvider } from "../context/Web3Modal";
import "../styles/globals.css"; // Importar los estilos globales
import theme from "@/theme";

function MyApp({ Component, pageProps }) {
  return (
    <Web3ModalProvider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Web3ModalProvider>
  );
}

export default MyApp;
