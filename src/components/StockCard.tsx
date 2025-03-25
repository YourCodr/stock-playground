
import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatPercentage, getTrendClass } from '@/utils/formatters';
import { ChevronRight } from 'lucide-react';
import { StockData } from '@/utils/stockData';

interface StockCardProps {
  stock: StockData;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const trendClass = getTrendClass(stock.percentChange);
  
  return (
    <Link 
      to={`/stock/${stock.id}`}
      className="glass-card-hover rounded-lg p-4 flex items-center justify-between mb-3 animate-fade-in"
    >
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-app-dark-200 flex items-center justify-center overflow-hidden mr-3">
          {stock.logo ? (
            <img src={stock.logo} alt={stock.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold">{stock.symbol.substring(0, 1)}</span>
          )}
        </div>
        
        <div>
          <h3 className="font-medium text-white">{stock.symbol}</h3>
          <p className="text-xs text-gray-400">{stock.name}</p>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="text-right mr-2">
          <div className="font-semibold">{formatCurrency(stock.price)}</div>
          <div className={`text-xs ${trendClass}`}>
            {formatPercentage(stock.percentChange)}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </div>
    </Link>
  );
};

export default StockCard;
