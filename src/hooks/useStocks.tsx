
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { stocks, initialUserData, type StockData, type UserHolding, type Transaction } from '../utils/stockData';
import { toast } from "sonner";

interface StockState {
  allStocks: StockData[];
  userWalletBalance: number;
  userHoldings: UserHolding[];
  transactions: Transaction[];
  profitEarned: number;
  
  // Actions
  buyStock: (stockId: string, quantity: number) => void;
  sellStock: (stockId: string, quantity: number) => void;
  resetSimulation: () => void;
  addToProfitEarned: (amount: number) => void;
  
  // Getters
  getPortfolioValue: () => number;
  getStockById: (id: string) => StockData | undefined;
  getHoldingByStockId: (stockId: string) => UserHolding | undefined;
}

export const useStockStore = create<StockState>()(
  persist(
    (set, get) => ({
      allStocks: stocks,
      userWalletBalance: initialUserData.walletBalance,
      userHoldings: initialUserData.holdings,
      transactions: initialUserData.transactions,
      profitEarned: 0,
      
      buyStock: (stockId: string, quantity: number) => {
        const stock = get().allStocks.find(s => s.id === stockId);
        if (!stock) {
          toast.error("Stock not found");
          return;
        }
        
        const totalCost = stock.price * quantity;
        if (totalCost > get().userWalletBalance) {
          toast.error("Insufficient funds in wallet");
          return;
        }
        
        // Update wallet balance
        set(state => ({
          userWalletBalance: state.userWalletBalance - totalCost,
        }));
        
        // Update holdings
        const existingHolding = get().userHoldings.find(h => h.stockId === stockId);
        if (existingHolding) {
          // Update existing holding
          set(state => ({
            userHoldings: state.userHoldings.map(h => 
              h.stockId === stockId 
                ? {
                    ...h,
                    quantity: h.quantity + quantity,
                    averageBuyPrice: ((h.averageBuyPrice * h.quantity) + (stock.price * quantity)) / (h.quantity + quantity)
                  }
                : h
            )
          }));
        } else {
          // Add new holding
          set(state => ({
            userHoldings: [
              ...state.userHoldings,
              {
                stockId,
                quantity,
                averageBuyPrice: stock.price
              }
            ]
          }));
        }
        
        // Add transaction record
        const transaction: Transaction = {
          id: `txn-${Date.now()}`,
          stockId,
          type: 'buy',
          price: stock.price,
          quantity,
          timestamp: new Date().toISOString(),
          total: totalCost
        };
        
        set(state => ({
          transactions: [transaction, ...state.transactions]
        }));
        
        toast.success(`Bought ${quantity} shares of ${stock.symbol}`);
      },
      
      sellStock: (stockId: string, quantity: number) => {
        const stock = get().allStocks.find(s => s.id === stockId);
        const holding = get().userHoldings.find(h => h.stockId === stockId);
        
        if (!stock || !holding) {
          toast.error("Stock holding not found");
          return;
        }
        
        if (quantity > holding.quantity) {
          toast.error("You don't have enough shares to sell");
          return;
        }
        
        const saleValue = stock.price * quantity;
        const originalCost = holding.averageBuyPrice * quantity;
        const profit = saleValue - originalCost;
        
        // Update wallet balance
        set(state => ({
          userWalletBalance: state.userWalletBalance + saleValue,
        }));
        
        // Update holdings
        set(state => ({
          userHoldings: state.userHoldings
            .map(h => {
              if (h.stockId === stockId) {
                if (h.quantity === quantity) {
                  return null; // Will be filtered out
                }
                return {
                  ...h,
                  quantity: h.quantity - quantity
                };
              }
              return h;
            })
            .filter(Boolean) as UserHolding[]
        }));
        
        // Add transaction record
        const transaction: Transaction = {
          id: `txn-${Date.now()}`,
          stockId,
          type: 'sell',
          price: stock.price,
          quantity,
          timestamp: new Date().toISOString(),
          total: saleValue
        };
        
        set(state => ({
          transactions: [transaction, ...state.transactions],
          profitEarned: state.profitEarned + profit
        }));
        
        toast.success(`Sold ${quantity} shares of ${stock.symbol}`);
        
        if (profit > 0) {
          toast(`Profit earned: ₹${profit.toFixed(2)}`, {
            description: "Great job on your investment!",
            action: {
              label: "View Portfolio",
              onClick: () => console.log("View portfolio clicked"),
            },
          });
        }
      },
      
      resetSimulation: () => {
        set({
          userWalletBalance: initialUserData.walletBalance,
          userHoldings: initialUserData.holdings,
          transactions: initialUserData.transactions,
          profitEarned: 0
        });
        toast.info("Simulation has been reset");
      },
      
      addToProfitEarned: (amount: number) => {
        set(state => ({
          profitEarned: state.profitEarned + amount
        }));
      },
      
      getPortfolioValue: () => {
        const { allStocks, userHoldings } = get();
        return userHoldings.reduce((total, holding) => {
          const stock = allStocks.find(s => s.id === holding.stockId);
          if (!stock) return total;
          return total + (stock.price * holding.quantity);
        }, 0);
      },
      
      getStockById: (id: string) => {
        return get().allStocks.find(s => s.id === id);
      },
      
      getHoldingByStockId: (stockId: string) => {
        return get().userHoldings.find(h => h.stockId === stockId);
      }
    }),
    {
      name: 'stock-storage',
    }
  )
);

export default useStockStore;
