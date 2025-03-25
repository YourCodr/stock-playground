
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import StockCard from '@/components/StockCard';
import WalletCard from '@/components/WalletCard';
import { useStockStore } from '@/hooks/useStocks';
import { formatCurrency, formatPercentage, getTrendClass } from '@/utils/formatters';
import { ArrowUpRight, Banknote, Clock, Coins, History, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { allStocks, userHoldings, getStockById, resetSimulation, profitEarned } = useStockStore();
  const [selectedTab, setSelectedTab] = useState<'stocks' | 'portfolio'>('stocks');
  const navigate = useNavigate();
  
  const marketStocks = allStocks.slice(0, 5); // Showing just first 5 stocks
  
  const portfolioStocks = userHoldings.map((holding) => {
    const stock = getStockById(holding.stockId);
    if (!stock) return null;
    
    const currentValue = stock.price * holding.quantity;
    const investedValue = holding.averageBuyPrice * holding.quantity;
    const profitLoss = currentValue - investedValue;
    const profitLossPercentage = (profitLoss / investedValue) * 100;
    
    return {
      ...stock,
      holding,
      currentValue,
      profitLoss,
      profitLossPercentage
    };
  }).filter(Boolean) as (typeof marketStocks[0] & { 
    holding: typeof userHoldings[0],
    currentValue: number,
    profitLoss: number,
    profitLossPercentage: number
  })[];
  
  const handleReset = () => {
    resetSimulation();
    toast.success("Simulation reset successfully");
  };
  
  const handleProfitClaim = () => {
    if (profitEarned > 1000) {
      navigate('/celebration');
    } else {
      toast("Keep trading to earn more profit!", {
        description: `You've earned ${formatCurrency(profitEarned)} so far. Earn at least ₹1,000 to claim your reward.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-app-dark-400 text-white">
      <Navbar />
      
      <main className="container max-w-3xl pb-20 px-4">
        <div className="mt-4 mb-6">
          <WalletCard />
          
          {profitEarned > 0 && (
            <div className="mt-4 glass-card rounded-xl p-4 flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  <Coins className="text-yellow-500 w-4 h-4 mr-2" />
                  <span className="text-sm text-gray-200">Profit Earned</span>
                </div>
                <p className="text-lg font-semibold text-white">{formatCurrency(profitEarned)}</p>
              </div>
              <Button 
                onClick={handleProfitClaim}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-medium"
              >
                Claim Reward
              </Button>
            </div>
          )}
        </div>
        
        <div className="tabs flex mb-4 border-b border-app-dark-200">
          <button
            onClick={() => setSelectedTab('stocks')}
            className={`py-2 px-4 ${
              selectedTab === 'stocks'
                ? 'text-app-blue-300 border-b-2 border-app-blue-300 font-medium'
                : 'text-gray-400'
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => setSelectedTab('portfolio')}
            className={`py-2 px-4 ${
              selectedTab === 'portfolio'
                ? 'text-app-blue-300 border-b-2 border-app-blue-300 font-medium'
                : 'text-gray-400'
            }`}
          >
            My Portfolio
          </button>
        </div>
        
        {selectedTab === 'stocks' && (
          <div className="stocks-list">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Market Trends</h2>
              <Button variant="ghost" size="sm" className="text-gray-400">
                <RefreshCw className="w-4 h-4 mr-1" />
                <span className="text-xs">Refresh</span>
              </Button>
            </div>
            
            {marketStocks.map((stock) => (
              <StockCard key={stock.id} stock={stock} />
            ))}
          </div>
        )}
        
        {selectedTab === 'portfolio' && (
          <div className="portfolio-list">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">My Investments</h2>
              <Button variant="ghost" size="sm" className="text-gray-400" onClick={handleReset}>
                <RefreshCw className="w-4 h-4 mr-1" />
                <span className="text-xs">Reset</span>
              </Button>
            </div>
            
            {portfolioStocks.length > 0 ? (
              <>
                {portfolioStocks.map((stockData) => (
                  <div 
                    key={stockData.id}
                    className="glass-card-hover rounded-lg p-4 mb-3 animate-fade-in"
                    onClick={() => navigate(`/stock/${stockData.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-app-dark-200 flex items-center justify-center overflow-hidden mr-3">
                          {stockData.logo ? (
                            <img src={stockData.logo} alt={stockData.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg font-bold">{stockData.symbol.substring(0, 1)}</span>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-white">{stockData.symbol}</h3>
                          <p className="text-xs text-gray-400">{stockData.holding.quantity} shares</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(stockData.currentValue)}</div>
                        <div className={`text-xs ${getTrendClass(stockData.profitLoss)}`}>
                          {formatPercentage(stockData.profitLossPercentage)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-app-dark-200 flex justify-between">
                      <div className="text-xs">
                        <span className="text-gray-400">Avg. price: </span>
                        <span className="text-white">{formatCurrency(stockData.holding.averageBuyPrice)}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-400">P/L: </span>
                        <span className={getTrendClass(stockData.profitLoss)}>
                          {formatCurrency(stockData.profitLoss)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-app-dark-300 flex items-center justify-center mx-auto mb-4">
                  <Banknote className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Investments Yet</h3>
                <p className="text-gray-400 text-sm mb-4">Start investing to build your portfolio</p>
                <Button 
                  onClick={() => setSelectedTab('stocks')} 
                  className="bg-app-blue-300 hover:bg-app-blue-400 text-white"
                >
                  Explore Stocks
                </Button>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center">
              <History className="w-4 h-4 mr-2" />
              Recent Activity
            </h2>
            <Button variant="link" size="sm" className="text-app-blue-300 p-0">
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          
          <div className="glass-card rounded-lg divide-y divide-app-dark-200">
            {useStockStore().transactions.slice(0, 3).map((transaction) => {
              const stock = getStockById(transaction.stockId);
              if (!stock) return null;
              
              return (
                <div key={transaction.id} className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'buy' ? 'bg-green-900/20' : 'bg-red-900/20'
                    }`}>
                      <Banknote className={`w-5 h-5 ${
                        transaction.type === 'buy' ? 'text-green-500' : 'text-red-500'
                      }`} />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">
                        {transaction.type === 'buy' ? 'Bought' : 'Sold'} {stock.symbol}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(transaction.timestamp).toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${
                      transaction.type === 'buy' ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {transaction.type === 'buy' ? '-' : '+'}{formatCurrency(transaction.total)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {transaction.quantity} × {formatCurrency(transaction.price)}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {useStockStore().transactions.length === 0 && (
              <div className="p-6 text-center">
                <Clock className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400">No transactions yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
