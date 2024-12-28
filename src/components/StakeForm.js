import { Box, Button, Text, VStack, Divider, Image } from "@chakra-ui/react";
import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { presaleAbi } from "../contracts/presale";
import { formatEther } from "viem";

const StakeForm = ({ onBack }) => {
  const { address } = useAccount();

  const presaleContractInfo = {
    address: process.env.NEXT_PUBLIC_PRESALE_CONTRACT_BSC_TESTNET,
    abi: presaleAbi,
  };

  const { data: getTotalPurchased } = useReadContract({
    ...presaleContractInfo,
    functionName: "getTotalPurchased",
    args: [address],
  });

  const { data: getAccumulatedRewards } = useReadContract({
    ...presaleContractInfo,
    functionName: "getAccumulatedRewards",
    args: [address],
  });

  const { data: totalLithiumsForSale } = useReadContract({
    ...presaleContractInfo,
    functionName: "totalLithiumsForSale",
  });

  const { data: tokensSold } = useReadContract({
    ...presaleContractInfo,
    functionName: "tokensSold",
  });

  const { data: priceUsdtResult } = useReadContract({
    ...presaleContractInfo,
    functionName: "pricePerLithiumUSD",
  });

  // Helper function to format numbers
  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatBNBRewards = (value) => {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(value);
  };


  const { data: isClaimEnabled } = useReadContract({
    ...presaleContractInfo,
    functionName: "isClaimEnabled",
  });

  // Calculate the price of Lithium in USD
  const lithiumPriceUsd = priceUsdtResult ? Number(formatEther(priceUsdtResult)) : 0;

  // Calculate the total number of tokens sold
  const soldTokens = tokensSold ? Number(formatEther(tokensSold)) : 0;

  // Define a base USD Raised for hardcoded part
  const baseUsdRaised = 1100000;

  // Calculate the total raised USD based on sold tokens
  const usdRaisedFromSold = soldTokens * lithiumPriceUsd;

  // Calculate the total USD raised (dynamic part)
  const totalUsdRaised = baseUsdRaised + usdRaisedFromSold;

  // Calculate the maximum USD cap based on the total tokens for sale
  const maxUsdCap = totalLithiumsForSale ? Number(formatEther(totalLithiumsForSale)) * lithiumPriceUsd : 0;

  // Calculate the progress percentage based on USD raised
  const raisedPercentage = maxUsdCap > 0 ? (totalUsdRaised / maxUsdCap) * 100 : 0;

  // Formula to adapt Total Sold based on Total Raised
  const adaptedTotalSold = totalUsdRaised / lithiumPriceUsd;

  return (
    <Box
      w={["90%", "450px", "500px"]}
      h={["580px", "614px", "726px"]}
      bgColor="#0E1621"
      border="2px solid #08FD19"
      borderRadius="5px"
      boxShadow="0px 0px 5px 2px #08FC008C"
      p={[4, 6, 8]}
      color="white"
      fontFamily="Roboto"
      margin="auto"
      position="relative" // Agregado para posicionar el pseudo-elemento
      display="flex"
      flexDirection="column"
      alignItems="center"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: "url('/bnbIcon.svg')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "60%",
        opacity: 0.3, // Ajusta la opacidad según tus necesidades (0 a 1)
        zIndex: 0, // Asegura que el pseudo-elemento esté detrás del contenido
      }}
    >
      <VStack spacing={[3, 4, 6]} align="center" w="100%">
        {/* Title */}
        <Text fontSize={["24px", "26px", "30px"]} fontWeight="500" textAlign="center">
          Lithium Ecosystem Presale
        </Text>

        {/* Display the dynamically calculated USD Raised */}
        <Text fontSize={["16px", "18px", "20px"]} fontWeight="500" textAlign="center">
          $USD RAISED: ${formatNumber(totalUsdRaised)}
        </Text>



        <Divider borderColor="#08FD19" borderWidth="1.5px" w="100%" />

        <VStack
          w="100%"
          align="start"
          border="2px solid #08FD19"
          p={4}
          boxShadow="0px 0px 5px 2px #08FC008C"
          borderRadius="5px"
        >
          <>
            <Text fontSize={["16px", "18px", "18px"]} fontWeight="500" textAlign="left">
              Total Tokens: {totalLithiumsForSale ? formatNumber(Number(formatEther(totalLithiumsForSale))) : "0.00"} $Lithium
            </Text>
            <Divider borderColor="#08FD19" borderWidth="1.5px" w="100%" />

            <Text fontSize={["16px", "18px", "18px"]} fontWeight="500" textAlign="left">
              Total Sold: {formatNumber(adaptedTotalSold)} $Lithium {/* Adapted total sold */}
            </Text>
            <Divider borderColor="#08FD19" borderWidth="1.5px" w="100%" />
            <Text fontSize={["16px", "18px", "18px"]} fontWeight="500" textAlign="left">
              Total Bought: {getTotalPurchased ? formatNumber(Number(formatEther(getTotalPurchased))) : "0.00"} $Lithium
            </Text>
            <Divider borderColor="#08FD19" borderWidth="1.5px" w="100%" />
            <Text fontSize={["16px", "18px", "18px"]} fontWeight="500" textAlign="left">
              Total stake rewards: {getAccumulatedRewards ? formatBNBRewards(Number(formatEther(getAccumulatedRewards))) : "0"} BNB
            </Text>
          </>
        </VStack>

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
          bg="#1A202C"
          border="2px solid #08FD19"
          color="white"
          w="full"
          h="40px"
          _hover={{ bg: "#1A202C" }}
          borderRadius="5px"
          fontSize="18px"
          fontWeight="400"
          onClick={onBack}
        >
          Back to Presale
        </Button>
        <Image src="/lithiumBanner.png"  w={"280px"} />

      </VStack>
    </Box>
  );
};

export default StakeForm;
