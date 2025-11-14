import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo, memo } from 'react';
import { useChartTheme } from '../Charts/theme';
import AccessibleChart from '../Charts/AccessibleChart';

interface SalesDataPoint {
  date: string;
  amount: number;
}

interface SalesChartProps {
  data?: SalesDataPoint[];
  isLoading?: boolean;
}

function SalesChartComp({ data, isLoading }: SalesChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return generateDummyData();
    }
    return data;
  }, [data]);

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-64 w-full bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  const theme = useChartTheme();

  return (
    <AccessibleChart
      className="h-[400px] w-full"
      label="Sales revenue area chart"
      description="Area chart showing daily revenue for the selected period. Peaks indicate higher sales days and troughs represent slower performance."
      hideDescriptionVisually
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 24, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.gradientFrom} stopOpacity={0.35} />
              <stop offset="95%" stopColor={theme.gradientFrom} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.grid} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: theme.axisTick, fontSize: 12 }}
            tickMargin={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: theme.axisTick, fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
            width={72}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltipBg,
              border: `1px solid ${theme.tooltipBorder}`,
              borderRadius: '10px',
              boxShadow: '0 8px 24px -4px rgba(0,0,0,0.25)',
              padding: '12px 16px'
            }}
            labelStyle={{ color: theme.tooltipLabel, fontWeight: 600 }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke={theme.areaStroke}
            strokeWidth={2.2}
            fill="url(#colorAmount)"
            activeDot={{ r: 5, strokeWidth: 2 }}
            animationDuration={750}
          />
        </AreaChart>
      </ResponsiveContainer>
    </AccessibleChart>
  );
}

export default memo(SalesChartComp);

function generateDummyData() {
  const data = [];
  const today = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: Math.floor(Math.random() * 10000) + 5000,
    });
  }
  return data;
}
