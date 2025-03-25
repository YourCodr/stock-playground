
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { useStockStore } from '@/hooks/useStocks';
import { formatCurrency } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Banknote, CheckCircle, PartyPopper, Sparkles } from 'lucide-react';

const Confetti = () => {
  const confetti = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    size: Math.random() * 2 + 0.5,
    color: [
      '#FF5252', // Red
      '#FFD740', // Amber
      '#64B5F6', // Blue
      '#4CAF50', // Green
      '#E040FB', // Purple
      '#FFEB3B', // Yellow
    ][Math.floor(Math.random() * 6)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map(item => (
        <motion.div
          key={item.id}
          className="absolute w-2 h-2 rounded-full"
          style={{ 
            left: `${item.x}%`, 
            top: '-5%', 
            backgroundColor: item.color,
            width: `${item.size}rem`,
            height: `${item.size}rem`,
          }}
          initial={{ y: '-10%', opacity: 1, rotate: 0 }}
          animate={{ 
            y: '120vh', 
            opacity: [1, 1, 0.7, 0.5, 0], 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 5, 
            delay: item.delay, 
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeOut" 
          }}
        />
      ))}
    </div>
  );
};

const Celebration = () => {
  const navigate = useNavigate();
  const { profitEarned, userWalletBalance } = useStockStore();
  const [claimComplete, setClaimComplete] = useState(false);
  
  useEffect(() => {
    if (profitEarned < 1000) {
      navigate('/');
    }
    
    // Auto-claim after 3 seconds
    const timer = setTimeout(() => {
      setClaimComplete(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate, profitEarned]);
  
  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-dark-400 to-app-dark-500 text-white overflow-hidden">
      <Navbar title="Congratulations!" />
      
      <Confetti />
      
      <main className="container max-w-md mx-auto h-[calc(100vh-6rem)] flex flex-col items-center justify-center px-4 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card w-full rounded-2xl p-8 border border-white/10 text-center"
        >
          <motion.div 
            className="w-20 h-20 rounded-full bg-green-600/20 flex items-center justify-center mx-auto mb-4"
            initial={{ y: 10 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
          >
            <PartyPopper className="w-10 h-10 text-yellow-400" />
          </motion.div>
          
          <motion.h1 
            className="text-2xl font-bold mb-2 text-gradient"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Trading Success!
          </motion.h1>
          
          <motion.p 
            className="text-gray-300 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            You've made smart investment decisions and earned a reward!
          </motion.p>
          
          <motion.div
            className="bg-app-dark-300/50 p-6 rounded-xl mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <p className="text-sm text-gray-400 mb-2">Your Trading Profit</p>
            <div className="text-3xl font-bold text-gradient-blue mb-1">
              {formatCurrency(profitEarned)}
            </div>
            <p className="text-sm text-green-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 mr-1" />
              <span>Added to Your Wallet!</span>
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-app-dark-300/50 p-4 rounded-xl mb-6 flex justify-between items-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <div className="flex items-center">
              <Banknote className="w-5 h-5 text-app-blue-300 mr-2" />
              <span className="text-sm text-gray-300">New Wallet Balance</span>
            </div>
            <span className="font-semibold">{formatCurrency(userWalletBalance)}</span>
          </motion.div>
          
          {claimComplete && (
            <motion.div
              className="flex items-center justify-center text-green-400 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Reward Claimed Successfully!</span>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: claimComplete ? 1 : 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-app-blue-300 to-app-blue-400 text-white font-medium hover:from-app-blue-400 hover:to-app-blue-500"
            >
              Continue Trading
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Celebration;
