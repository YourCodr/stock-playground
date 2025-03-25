
import React, { useState, useEffect } from 'react';
import { useStockStore } from '@/hooks/useStocks';
import { StockData } from '@/utils/stockData';
import { formatCurrency } from '@/utils/formatters';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: StockData;
  transactionType: 'buy' | 'sell';
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  stock,
  transactionType,
}) => {
  const { buyStock, sellStock, userWalletBalance, getHoldingByStockId } = useStockStore();
  const [quantity, setQuantity] = useState(1);
  const [estimatedCost, setEstimatedCost] = useState(stock.price);
  const [maxQuantity, setMaxQuantity] = useState(1);
  
  const holding = getHoldingByStockId(stock.id);
  
  useEffect(() => {
    if (transactionType === 'buy') {
      // Max quantity based on wallet balance
      const maxPossible = Math.floor(userWalletBalance / stock.price);
      setMaxQuantity(maxPossible > 0 ? maxPossible : 1);
    } else {
      // Max quantity based on current holdings
      setMaxQuantity(holding ? holding.quantity : 0);
    }
    
    // Reset quantity when modal opens
    setQuantity(1);
  }, [isOpen, stock.price, transactionType, userWalletBalance, holding]);
  
  useEffect(() => {
    setEstimatedCost(stock.price * quantity);
  }, [quantity, stock.price]);
  
  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    }
  };
  
  const handleSubmit = () => {
    if (transactionType === 'buy') {
      buyStock(stock.id, quantity);
    } else {
      sellStock(stock.id, quantity);
    }
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-app-dark-300 border-app-dark-100 text-white p-6 max-w-sm mx-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            {transactionType === 'buy' ? 'Buy' : 'Sell'} {stock.symbol}
          </DialogTitle>
          <div className="flex items-center justify-center mt-2">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Current Price</p>
              <p className="text-xl font-bold text-white">{formatCurrency(stock.price)}</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-app-dark-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-2">Quantity</p>
            <div className="flex items-center justify-between">
              <Button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-app-dark-100 text-white"
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <span className="text-xl font-semibold">{quantity}</span>
              
              <Button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= maxQuantity}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-app-dark-100 text-white"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Estimated {transactionType === 'buy' ? 'Cost' : 'Value'}</span>
              <span className="font-medium">{formatCurrency(estimatedCost)}</span>
            </div>
            
            {transactionType === 'buy' && (
              <div className="flex justify-between">
                <span className="text-gray-400">Wallet Balance</span>
                <span className="font-medium">{formatCurrency(userWalletBalance)}</span>
              </div>
            )}
            
            {transactionType === 'sell' && holding && (
              <div className="flex justify-between">
                <span className="text-gray-400">Current Holdings</span>
                <span className="font-medium">{holding.quantity} shares</span>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full bg-transparent border-gray-600 text-white hover:bg-app-dark-200"
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleSubmit}
            className={`w-full ${
              transactionType === 'buy' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            } text-white`}
            disabled={
              (transactionType === 'buy' && estimatedCost > userWalletBalance) ||
              (transactionType === 'sell' && (!holding || holding.quantity < quantity))
            }
          >
            {transactionType === 'buy' ? 'Buy Now' : 'Sell Now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
