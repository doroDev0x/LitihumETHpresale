// pages/index.js

import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import LithiumPresale from '../components/LithiumPresale';
import StakeForm from '../components/StakeForm';

const HomePage = () => {
  const [currentView, setCurrentView] = useState('presale'); // 'presale' o 'stake'

  const handleStakeClick = () => {
    setCurrentView('stake');
  };

  const handlePresaleClick = () => {
    setCurrentView('presale');
  };

  return (
    <Box minHeight="100vh" bg="black" w={"100%"} p={4} margin={"auto"}>
      {currentView === 'presale' ? (
        <LithiumPresale onStake={handleStakeClick} />
      ) : (
        <StakeForm onBack={handlePresaleClick} />
      )}
    </Box>
  );
};

export default HomePage;
