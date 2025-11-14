import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { memo } from 'react';
import { useChartTheme } from '../Charts/theme';
import { Package } from 'lucide-react';
import AccessibleChart from '../Charts/AccessibleChart';

interface Product {
  name: string;
  sales: number;
  revenue: number;
}

interface TopProductsProps {
  products?: Product[];
  isLoading?: boolean;
}

function TopProductsComp({ products, isLoading }: TopProductsProps) {
  const displayData = products?.slice(0, 5) || generateDummyData();
  const theme = useChartTheme();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="h-64 w-full bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart */}
      <AccessibleChart
        className="h-[300px]"
        label="Top products bar chart"
        description="Horizontal bar chart ranking the top five products by revenue. Longer bars indicate higher revenue."
        hideDescriptionVisually
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            layout="vertical"
            margin={{ top: 10, right: 24, left: 16, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke={theme.grid} />
            <XAxis type="number" tickFormatter={(value) => `$${value}`} tick={{ fill: theme.axisTick, fontSize: 12 }} />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              width={120}
              tick={{ fill: theme.axisTick, fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.tooltipBg,
                border: `1px solid ${theme.tooltipBorder}`,
                borderRadius: '10px',
                boxShadow: '0 8px 24px -4px rgba(0,0,0,0.25)',
                padding: '12px 16px'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Bar
              dataKey="revenue"
              fill={theme.areaStroke}
              radius={[0, 6, 6, 0]}
              animationDuration={700}
            />
          </BarChart>
        </ResponsiveContainer>
      </AccessibleChart>

      {/* List View */}
      <div className="space-y-2">
        {displayData.map((product, index) => (
          <div
            key={product.name}
            className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                {index + 1}. {product.name}
              </h4>
              <p className="text-xs text-gray-500">{product.sales} sales</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">${product.revenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Revenue</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(TopProductsComp);

function generateDummyData(): Product[] {
  return [
    { name: 'Laptop Pro', sales: 125, revenue: 187500 },
    { name: 'Wireless Earbuds', sales: 300, revenue: 45000 },
    { name: 'Smart Watch', sales: 200, revenue: 80000 },
    { name: 'Gaming Console', sales: 150, revenue: 75000 },
    { name: 'Tablet Air', sales: 180, revenue: 108000 },
  ];
}
