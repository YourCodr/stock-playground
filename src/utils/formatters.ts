
// Utility functions for formatting numbers, currency, etc.

// Format currency in Indian Rupees
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format number with commas (Indian format)
export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('en-IN').format(number);
};

// Format percentage with 2 decimal places and % symbol
export const formatPercentage = (percentage: number): string => {
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
};

// Format large numbers with appropriate suffixes (K, L, Cr)
export const formatCompactNumber = (number: number): string => {
  if (number >= 10000000) { // 1 Cr
    return `${(number / 10000000).toFixed(2)} Cr`;
  } else if (number >= 100000) { // 1 Lakh
    return `${(number / 100000).toFixed(2)} L`;
  } else if (number >= 1000) { // 1K
    return `${(number / 1000).toFixed(2)}K`;
  }
  return number.toString();
};

// Format date string to readable date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Format time string 
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get CSS class based on trend direction
export const getTrendClass = (value: number): string => {
  if (value > 0) return 'up-trend';
  if (value < 0) return 'down-trend';
  return 'text-market-neutral';
};
