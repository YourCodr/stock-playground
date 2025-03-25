
import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoricalDataPoint } from '@/utils/stockData';
import { formatCurrency } from '@/utils/formatters';

interface StockChartProps {
  data: HistoricalDataPoint[];
  color?: string;
  fullWidth?: boolean;
  height?: number;
  showControls?: boolean;
}

const TimeRangeButton = ({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-xs rounded-full transition-all ${
      active
        ? 'bg-app-blue-300 text-white'
        : 'text-gray-400 hover:text-white bg-app-dark-200 hover:bg-app-dark-100'
    }`}
  >
    {label}
  </button>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card p-3 rounded-lg shadow-lg border border-white/10 text-sm">
        <p className="font-semibold text-white">{new Date(data.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
        <p className="text-white">Open: {formatCurrency(data.open)}</p>
        <p className="text-white">Close: {formatCurrency(data.close)}</p>
        <p className="text-white">High: {formatCurrency(data.high)}</p>
        <p className="text-white">Low: {formatCurrency(data.low)}</p>
      </div>
    );
  }
  return null;
};

const StockChart: React.FC<StockChartProps> = ({ 
  data, 
  color = "#0070F3", 
  fullWidth = false,
  height = 300,
  showControls = true
}) => {
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | 'ALL'>('1M');
  const [filteredData, setFilteredData] = useState<HistoricalDataPoint[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (data) {
      let filtered;
      const now = new Date();
      
      switch (timeRange) {
        case '1D':
          filtered = data.slice(-2);
          break;
        case '1W':
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          filtered = data.filter(d => new Date(d.date) >= weekAgo);
          break;
        case '1M':
          const monthAgo = new Date();
          monthAgo.setMonth(now.getMonth() - 1);
          filtered = data.filter(d => new Date(d.date) >= monthAgo);
          break;
        case '3M':
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          filtered = data.filter(d => new Date(d.date) >= threeMonthsAgo);
          break;
        case 'ALL':
        default:
          filtered = data;
      }
      
      setFilteredData(filtered);
    }
  }, [data, timeRange]);

  // Format data for chart
  const chartData = filteredData.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
  }));

  const isPositive = chartData.length > 1 && 
    chartData[chartData.length - 1].close > chartData[0].close;
  
  const chartColor = isPositive ? '#4CAF50' : '#F44336';

  return (
    <div 
      ref={chartRef}
      className={`${fullWidth ? 'w-full' : 'w-full max-w-md'} rounded-xl p-4 glass-card`}
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              minTickGap={20}
            />
            <YAxis 
              domain={['dataMin - 50', 'dataMax + 50']}
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="close"
              stroke={chartColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: chartColor, stroke: 'white', strokeWidth: 1 }}
              fillOpacity={1}
              fill="url(#colorGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {showControls && (
        <div className="flex justify-center mt-4 space-x-2">
          <TimeRangeButton
            active={timeRange === '1D'}
            label="1D"
            onClick={() => setTimeRange('1D')}
          />
          <TimeRangeButton
            active={timeRange === '1W'}
            label="1W"
            onClick={() => setTimeRange('1W')}
          />
          <TimeRangeButton
            active={timeRange === '1M'}
            label="1M"
            onClick={() => setTimeRange('1M')}
          />
          <TimeRangeButton
            active={timeRange === '3M'}
            label="3M"
            onClick={() => setTimeRange('3M')}
          />
          <TimeRangeButton
            active={timeRange === 'ALL'}
            label="ALL"
            onClick={() => setTimeRange('ALL')}
          />
        </div>
      )}
    </div>
  );
};

export default StockChart;
