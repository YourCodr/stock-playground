
import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { useStockStore } from '@/hooks/useStocks';
import { ArrowUpRight, Wallet } from 'lucide-react';

const WalletCard: React.FC = () => {
  const { userWalletBalance, getPortfolioValue } = useStockStore();
  
  const portfolioValue = getPortfolioValue();
  const totalValue = userWalletBalance + portfolioValue;
  
  return (
    <div className="rounded-xl glass-card p-5 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <Wallet size={16} className="text-app-blue-200 mr-2" />
          <h2 className="text-sm font-medium text-gray-300">Total Balance</h2>
        </div>
        <ArrowUpRight size={16} className="text-gray-400" />
      </div>
      
      <div className="text-2xl font-bold text-white mb-4">
        {formatCurrency(totalValue)}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-app-dark-300/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Available</p>
          <p className="text-white font-medium">{formatCurrency(userWalletBalance)}</p>
        </div>
        
        <div className="bg-app-dark-300/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Portfolio</p>
          <p className="text-white font-medium">{formatCurrency(portfolioValue)}</p>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
