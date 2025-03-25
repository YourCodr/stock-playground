
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Menu, User, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useStockStore } from '@/hooks/useStocks';
import { formatCurrency } from '@/utils/formatters';

interface NavbarProps {
  showBackButton?: boolean;
  title?: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  showBackButton = false,
  title = "Paytm Money"
}) => {
  const location = useLocation();
  const { userWalletBalance } = useStockStore();

  return (
    <header className="glass-card sticky top-0 z-50 p-4 backdrop-blur-md border-b border-white/10 bg-app-dark-400/90">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <Link to="/" className="text-white p-1">
              <ChevronLeft className="w-6 h-6" />
            </Link>
          ) : (
            <Button variant="ghost" size="icon" className="text-white p-1">
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-lg font-medium">{title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {!location.pathname.includes('/celebration') && (
            <div className="hidden md:block text-right">
              <div className="text-xs text-gray-400">Wallet Balance</div>
              <div className="text-sm font-semibold text-white">{formatCurrency(userWalletBalance)}</div>
            </div>
          )}
          
          <Button variant="ghost" size="icon" className="text-white p-1 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <Button variant="ghost" size="icon" className="text-white p-1">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
