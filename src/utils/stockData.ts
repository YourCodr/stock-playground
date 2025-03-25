
// Mock historical stock data for a few companies

export interface StockData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  previousClose: number;
  change: number;
  percentChange: number;
  volume: number;
  marketCap: number;
  historicalData: HistoricalDataPoint[];
  sector: string;
  logo: string;
}

export interface HistoricalDataPoint {
  date: string; // ISO date string
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface UserHolding {
  stockId: string;
  quantity: number;
  averageBuyPrice: number;
}

export interface Transaction {
  id: string;
  stockId: string;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  timestamp: string; // ISO date string
  total: number;
}

// Generate random historical data
const generateHistoricalData = (
  basePrice: number, 
  volatility: number, 
  days: number
): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  let currentPrice = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Generate random price movement
    const changePercent = (Math.random() - 0.5) * volatility;
    const change = currentPrice * changePercent;
    const newPrice = Math.max(currentPrice + change, 0.1);
    
    // Random high, low within the day
    const high = newPrice * (1 + Math.random() * 0.02);
    const low = newPrice * (1 - Math.random() * 0.02);
    const open = newPrice * (1 + (Math.random() - 0.5) * 0.01);
    
    // Random volume
    const volume = Math.round(Math.random() * 10000000) + 1000000;
    
    data.push({
      date: date.toISOString(),
      open,
      high,
      low,
      close: newPrice,
      volume,
    });
    
    currentPrice = newPrice;
  }
  
  return data;
};

// Stock data
export const stocks: StockData[] = [
  {
    id: "reliance",
    symbol: "RELIANCE",
    name: "Reliance Industries",
    price: 2832.45,
    previousClose: 2810.15,
    change: 22.30,
    percentChange: 0.79,
    volume: 4823501,
    marketCap: 19145900000000,
    historicalData: generateHistoricalData(2800, 0.02, 30),
    sector: "Energy",
    logo: "https://companieslogo.com/img/orig/RELIANCE.NS-7401f1bd.png?t=1611121599",
  },
  {
    id: "tcs",
    symbol: "TCS",
    name: "Tata Consultancy Services",
    price: 3545.20,
    previousClose: 3580.90,
    change: -35.70,
    percentChange: -1.00,
    volume: 2341567,
    marketCap: 12785790000000,
    historicalData: generateHistoricalData(3580, 0.015, 30),
    sector: "Information Technology",
    logo: "https://companieslogo.com/img/orig/TCS.NS-7401f1bd.png?t=1611121599",
  },
  {
    id: "hdfcbank",
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    price: 1652.30,
    previousClose: 1645.10,
    change: 7.20,
    percentChange: 0.44,
    volume: 5621478,
    marketCap: 9245670000000,
    historicalData: generateHistoricalData(1640, 0.01, 30),
    sector: "Financial Services",
    logo: "https://companieslogo.com/img/orig/HDB-bb9c9e7a.png?t=1633218477",
  },
  {
    id: "infy",
    symbol: "INFY",
    name: "Infosys",
    price: 1452.80,
    previousClose: 1480.50,
    change: -27.70,
    percentChange: -1.87,
    volume: 3254892,
    marketCap: 6012390000000,
    historicalData: generateHistoricalData(1480, 0.025, 30),
    sector: "Information Technology",
    logo: "https://companieslogo.com/img/orig/INFY-bb9919e7.png?t=1633500727",
  },
  {
    id: "bhartiartl",
    symbol: "BHARTIARTL",
    name: "Bharti Airtel",
    price: 892.55,
    previousClose: 880.20,
    change: 12.35,
    percentChange: 1.40,
    volume: 2985631,
    marketCap: 5009870000000,
    historicalData: generateHistoricalData(880, 0.018, 30),
    sector: "Telecommunications",
    logo: "https://companieslogo.com/img/orig/BHARTIARTL.NS-7401f1bd.png?t=1611121599",
  }
];

// Initial user data
export const initialUserData = {
  walletBalance: 100000,
  holdings: [] as UserHolding[],
  transactions: [] as Transaction[],
};
