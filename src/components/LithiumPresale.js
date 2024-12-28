import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  HStack,
  Divider,
  Progress,
  Image,
  Switch,
  FormControl,
  FormLabel,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { FaEthereum } from "react-icons/fa"; // Importa el ícono de Ethereum
import { presaleAbi } from "../contracts/presale";
import {
  useAccount,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { parseEther, formatEther } from "viem";

const LithiumPresale = ({ onStake }) => {
  const [amount, setAmount] = useState("");
  const [lithiumToReceive, setLithiumToReceive] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [currency, setCurrency] = useState("BNB"); // Estado para la moneda seleccionada
  const { open } = useWeb3Modal();
  const { address } = useAccount();

  const baseUsdRaised = 1100000;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const censorAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const handleAmountChange = (e) => {
    const inputAmount = parseFloat(e.target.value) || 0;
    setAmount(e.target.value);

    let priceInUsd;
    if (currency === "BNB" && getLatestPriceBNB && priceUsdtResult) {
      const bnbPriceInUsd = Number(formatEther(getLatestPriceBNB));
      const lithiumPriceInUsd = Number(formatEther(priceUsdtResult));
      priceInUsd = bnbPriceInUsd;
      const tokens = (inputAmount * bnbPriceInUsd) / lithiumPriceInUsd;
      setLithiumToReceive(tokens.toFixed(2));
    } else if (currency === "ETH" && getLatestPriceETH && priceUsdtResult) {
      const ethPriceInUsd = Number(formatEther(getLatestPriceETH));
      const lithiumPriceInUsd = Number(formatEther(priceUsdtResult));
      priceInUsd = ethPriceInUsd;
      const tokens = (inputAmount * ethPriceInUsd) / lithiumPriceInUsd;
      setLithiumToReceive(tokens.toFixed(2));
    } else {
      setLithiumToReceive("0.00");
    }
  };

  const presaleContractInfo = {
    address:
      currency === "BNB"
        ? process.env.NEXT_PUBLIC_PRESALE_CONTRACT_BSC_TESTNET
        : process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ETH_MAINNET, // Asegúrate de definir esta variable en tus variables de entorno
    abi: presaleAbi,
  };

  const { data: totalLithiumsForSale } = useReadContract({
    ...presaleContractInfo,
    functionName: "totalLithiumsForSale",
  });

  const { data: tokensSold } = useReadContract({
    ...presaleContractInfo,
    functionName: "tokensSold",
  });

  const { data: getLatestPriceBNB } = useReadContract({
    ...presaleContractInfo,
    functionName: "getLatestPriceBNB", // Asegúrate de que esta función exista en tu contrato
  });

  const { data: getLatestPriceETH } = useReadContract({
    ...presaleContractInfo,
    functionName: "getLatestPriceETH", // Asegúrate de que esta función exista en tu contrato
  });

  const { data: priceUsdtResult } = useReadContract({
    ...presaleContractInfo,
    functionName: "pricePerLithiumUSD",
  });

  const { data: isClaimEnabled } = useReadContract({
    ...presaleContractInfo,
    functionName: "isClaimEnabled",
  });

  const { data: isPresaleActive } = useReadContract({
    ...presaleContractInfo,
    functionName: "isPresaleActive",
  });

  const { writeContract: writeBuyTokensWithEth } = useWriteContract();
  const { writeContract: writeBuyTokensWithBnb } = useWriteContract(); // Función para BNB

  // Calcular el precio de Lithium en USD
  const lithiumPriceUsd = priceUsdtResult
    ? Number(formatEther(priceUsdtResult))
    : 0;

  // Calcular el total de tokens vendidos
  const soldTokens = tokensSold ? Number(formatEther(tokensSold)) : 0;

  // Calcular el total recaudado en USD (capped)
  const maxUsdRaised = totalLithiumsForSale
    ? Number(formatEther(totalLithiumsForSale)) * lithiumPriceUsd
    : 0;
  const usdRaisedFromSold = soldTokens * lithiumPriceUsd;
  const totalUsdRaised = Math.min(baseUsdRaised + usdRaisedFromSold, maxUsdRaised);

  // Calcular el porcentaje de progreso
  const raisedPercentage =
    maxUsdRaised > 0 ? (totalUsdRaised / maxUsdRaised) * 100 : 0;

  const handleCurrencyToggle = () => {
    setCurrency((prev) => (prev === "BNB" ? "ETH" : "BNB"));
    setAmount("");
    setLithiumToReceive("0.00");
  };

  return (
    <Box
      w={["90%", "450px", "500px"]}
      h={["580px", "614px", "726px"]}
      bg="#0E1621"
      border="2px solid #08FD19"
      borderRadius="5px"
      boxShadow="0px 0px 5px 2px #08FC008C"
      p={[4, 6, 8]}
      color="white"
      fontFamily="Roboto"
      margin="auto"
      bgImage="url('/lithiumLogo.webp')"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <VStack spacing={[3, 4, 6]} align="center" w="100%">
        <Text
          fontSize={["24px", "26px", "30px"]}
          fontWeight="500"
          textAlign="center"
        >
          Lithium Ecosystem Presale
        </Text>

        {/* Display the dynamically calculated USD Raised */}
        <Text
          fontSize={["16px", "18px", "20px"]}
          fontWeight="500"
          textAlign="center"
        >
          $USD RAISED:{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(totalUsdRaised)}
        </Text>

        <Box w="100%">
          <Progress
            value={raisedPercentage}
            size="sm"
            w="100%"
            h="20px"
            isAnimated
            hasStripe
          />
          <Text
            fontSize={["sm", "md", "sm"]}
            color="white"
            textAlign="center"
            mt={4}
          >
            Raised {raisedPercentage.toFixed(2)}%
          </Text>
        </Box>

        <VStack w="100%" align="start">
          <Text
            fontSize={["16px", "18px", "18px"]}
            fontWeight="500"
            textAlign="left"
          >
            Presale: 1 $Lithium = ${lithiumPriceUsd.toFixed(2)}
          </Text>
          <Text
            fontSize={["16px", "18px", "18px"]}
            fontWeight="500"
            textAlign="left"
          >
            Listing: 1 $Lithium = $1.5
          </Text>
        </VStack>

        <Divider borderColor="#03910D" borderWidth="1.5px" w="100%" />

        {/* Switch para cambiar la moneda */}
        <FormControl display="flex" alignItems="center" w="100%" mt={4}>
          <Flex align="center" w="100%">
            {/* Etiqueta BNB */}
            <Flex align="center">
              <Image
                src="/bnbIcon.svg"
                alt="BNB Icon"
                boxSize={["20px", "24px", "24px"]}
                mr={2}
              />
              <Text>BNB</Text>
            </Flex>

            <Spacer />

            {/* Switch */}
            <Switch
              id="currency-switch"
              isChecked={currency === "ETH"}
              onChange={handleCurrencyToggle}
              colorScheme="green"
              size="lg"
            />

            <Spacer />

            {/* Etiqueta ETH con ícono */}
            <Flex align="center">
              <FaEthereum size={24} style={{ marginRight: "8px" }} />
              <Text>ETH</Text>
            </Flex>
          </Flex>
        </FormControl>

        <VStack spacing={[2, 3, 4]} w="100%">
          <Button
            w="100%"
            h={["40px", "45px", "50px"]}
            bg="#1A202C"
            onClick={() => {
              open();
            }}
            border="2px solid #08FD19"
            color="white"
            _hover={{ bg: "#00bfa3" }}
            _active={{ bg: "#00bfa3" }}
            borderRadius="5px"
            fontSize={["14px", "16px", "18px"]}
            fontWeight="400"
          >
            {address ? `Account: ${censorAddress(address)}` : "CONNECT WALLET"}
          </Button>

          <Button
            w="100%"
            h={["40px", "45px", "50px"]}
            bg="#1A202C"
            disabled={!isPresaleActive}
            border="2px solid #08FD19"
            onClick={() => {
              if (currency === "BNB") {
                writeBuyTokensWithBnb({
                  address: presaleContractInfo.address,
                  abi: presaleContractInfo.abi,
                  functionName: "buyTokensWithBnb", // Asegúrate de que esta función exista en tu contrato
                  value: amount ? parseEther(amount) : 0,
                  gasLimit: 3000000,
                });
              } else {
                writeBuyTokensWithEth({
                  address: presaleContractInfo.address,
                  abi: presaleContractInfo.abi,
                  functionName: "buyTokensWithEth",
                  value: amount ? parseEther(amount) : 0,
                  gasLimit: 3000000,
                });
              }
            }}
            color="white"
            _hover={{ bg: "#00bfa3" }}
            _active={{ bg: "#00bfa3" }}
            borderRadius="5px"
            fontSize={["14px", "16px", "18px"]}
            fontWeight="400"
            leftIcon={
              currency === "BNB" ? (
                <Image
                  src="/bnbIcon.svg"
                  alt="BNB Icon"
                  boxSize={["16px", "18px", "18px"]}
                />
              ) : (
                <FaEthereum size={18} />
              )
            }
          >
            Buy Presale & Stake
          </Button>

          <Button
            w="100%"
            h={["40px", "45px", "50px"]}
            bg="#1A202C"
            border="2px solid #08FD19"
            color="white"
            _hover={{ bg: "#00bfa3" }}
            _active={{ bg: "#00bfa3" }}
            borderRadius="5px"
            fontSize={["14px", "16px", "18px"]}
            fontWeight="400"
            disabled={!isClaimEnabled}
          >
            Claim now
          </Button>
          <Button
            w="100%"
            h={["40px", "45px", "50px"]}
            bg="#1A202C"
            border="2px solid #08FD19"
            color="white"
            _hover={{ bg: "#00bfa3" }}
            _active={{ bg: "#00bfa3" }}
            borderRadius="5px"
            fontSize={["14px", "16px", "18px"]}
            fontWeight="400"
            onClick={onStake}
          >
            My Purchases
          </Button>
        </VStack>

        <HStack w="100%" spacing={[2, 3, 4]} mt={[4, 5, 6]}>
          <Input
            value={amount}
            onChange={handleAmountChange}
            type="number"
            bg="transparent"
            color="white"
            border="1px solid #08FD19"
            fontSize={["12px", "14px", "14px"]}
            fontWeight="400"
            h={["35px", "40px", "40px"]}
            w="100%"
            placeholder={`Enter Amount in ${currency}`}
          />
          <Input
            value={lithiumToReceive}
            readOnly
            bg="transparent"
            color="white"
            border="1px solid #08FD19"
            fontSize={["12px", "14px", "14px"]}
            fontWeight="400"
            h={["35px", "40px", "40px"]}
            w="100%"
            placeholder="0.00"
          />
        </HStack>
      </VStack>
    </Box>
  );
};

export default LithiumPresale;
