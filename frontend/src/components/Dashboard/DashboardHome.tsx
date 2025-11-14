import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
];

const MetricCard = ({ title, value, trend, icon: Icon }) => (
  <Card className="flex items-start justify-between p-6">
    <div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
      <p className="text-sm text-green-600 flex items-center mt-2">
        <ArrowUpRight size={16} className="mr-1" />
        {trend}
      </p>
    </div>
    <div className="p-3 bg-blue-50 rounded-lg">
      <Icon className="text-blue-600" size={24} />
    </div>
  </Card>
);

export const DashboardHome = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to RetailAnalytics</h1>
          <p className="text-gray-600 mt-1">Track your business performance and get AI-powered insights</p>
        </div>
        <Button icon={<TrendingUp />}>Generate Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Sales"
          value="$48,574"
          trend="+12.5% from last month"
          icon={DollarSign}
        />
        <MetricCard
          title="Active Customers"
          value="1,432"
          trend="+8.2% from last month"
          icon={Users}
        />
        <MetricCard
          title="Orders"
          value="826"
          trend="+5.3% from last month"
          icon={ShoppingCart}
        />
      </div>

      <Card className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Sales Overview</h3>
          <div className="space-x-2">
            <Button variant="outline" size="sm">Weekly</Button>
            <Button variant="outline" size="sm">Monthly</Button>
            <Button variant="outline" size="sm">Yearly</Button>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};