
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import StockChart from '@/components/StockChart';
import TransactionModal from '@/components/TransactionModal';
import { useStockStore } from '@/hooks/useStocks';
import { formatCurrency, formatPercentage, getTrendClass } from '@/utils/formatters';
import { ArrowDown, ArrowUp, Banknote, Calendar, LayoutGrid, TrendingUp, Volume } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const StockDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { getStockById, getHoldingByStockId } = useStockStore();
  
  const stock = getStockById(id || '');
  const holding = getHoldingByStockId(id || '');
  
  if (!stock) {
    toast.error("Stock not found");
    navigate('/');
    return null;
  }
  
  const handleOpenBuyModal = () => {
    setTransactionType('buy');
    setIsModalOpen(true);
  };
  
  const handleOpenSellModal = () => {
    setTransactionType('sell');
    setIsModalOpen(true);
  };
  
  const holdingValue = holding ? stock.price * holding.quantity : 0;
  const investedValue = holding ? holding.averageBuyPrice * holding.quantity : 0;
  const profitLoss = holdingValue - investedValue;
  const profitLossPercentage = investedValue > 0 ? (profitLoss / investedValue) * 100 : 0;
  
  const trendClass = getTrendClass(stock.percentChange);
  
  return (
    <div className="min-h-screen bg-app-dark-400 text-white">
      <Navbar showBackButton title={stock.name} />
      
      <main className="container max-w-3xl pb-20 px-4">
        <div className="flex items-center justify-between mt-4 mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-app-dark-300 flex items-center justify-center overflow-hidden mr-3">
              {stock.logo ? (
                <img src={stock.logo} alt={stock.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold">{stock.symbol.substring(0, 1)}</span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold">{stock.symbol}</h1>
              <p className="text-sm text-gray-400">{stock.name}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatCurrency(stock.price)}</div>
            <div className={`flex items-center justify-end ${trendClass}`}>
              {stock.percentChange > 0 ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              <span>{formatPercentage(stock.percentChange)}</span>
            </div>
          </div>
        </div>
        
        <StockChart data={stock.historicalData} fullWidth />
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Card className="glass-card">
            <CardContent className="p-4 flex flex-col items-center">
              <Volume className="w-5 h-5 text-app-blue-300 mb-2" />
              <p className="text-xs text-gray-400 mb-1">Volume</p>
              <p className="text-sm font-medium">{stock.volume.toLocaleString('en-IN')}</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4 flex flex-col items-center">
              <Calendar className="w-5 h-5 text-app-blue-300 mb-2" />
              <p className="text-xs text-gray-400 mb-1">Prev. Close</p>
              <p className="text-sm font-medium">{formatCurrency(stock.previousClose)}</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4 flex flex-col items-center">
              <LayoutGrid className="w-5 h-5 text-app-blue-300 mb-2" />
              <p className="text-xs text-gray-400 mb-1">Sector</p>
              <p className="text-sm font-medium">{stock.sector}</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4 flex flex-col items-center">
              <TrendingUp className="w-5 h-5 text-app-blue-300 mb-2" />
              <p className="text-xs text-gray-400 mb-1">Day Range</p>
              <p className="text-sm font-medium">
                {formatCurrency(stock.price * 0.98)} - {formatCurrency(stock.price * 1.02)}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {holding && (
          <div className="mt-6 glass-card rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Banknote className="w-5 h-5 mr-2" />
              Your Position
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-app-dark-300/50 p-3 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Quantity</p>
                <p className="text-white font-medium">{holding.quantity} shares</p>
              </div>
              
              <div className="bg-app-dark-300/50 p-3 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Avg. Buy Price</p>
                <p className="text-white font-medium">{formatCurrency(holding.averageBuyPrice)}</p>
              </div>
              
              <div className="bg-app-dark-300/50 p-3 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Current Value</p>
                <p className="text-white font-medium">{formatCurrency(holdingValue)}</p>
              </div>
              
              <div className="bg-app-dark-300/50 p-3 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">P/L</p>
                <p className={`font-medium ${getTrendClass(profitLoss)}`}>
                  {formatCurrency(profitLoss)} ({formatPercentage(profitLossPercentage)})
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 fixed bottom-0 left-0 right-0 glass-card border-t border-app-dark-200 p-4 flex items-center justify-between backdrop-blur-lg">
          <Button 
            onClick={handleOpenSellModal}
            className="w-1/2 mr-2 bg-red-600 hover:bg-red-700 text-white"
            disabled={!holding || holding.quantity <= 0}
          >
            Sell
          </Button>
          
          <Button 
            onClick={handleOpenBuyModal}
            className="w-1/2 ml-2 bg-green-600 hover:bg-green-700 text-white"
          >
            Buy
          </Button>
        </div>
      </main>
      
      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          stock={stock}
          transactionType={transactionType}
        />
      )}
    </div>
  );
};

export default StockDetail;
