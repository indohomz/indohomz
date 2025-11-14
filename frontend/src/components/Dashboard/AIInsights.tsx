import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Bot, BrainCircuit } from 'lucide-react';

export const AIInsights = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
            <p className="text-blue-100 mb-4">
              Get intelligent recommendations based on your data
            </p>
          </div>
          <div className="p-3 bg-white/20 rounded-lg">
            <BrainCircuit className="text-white" size={24} />
          </div>
        </div>
        <div className="mt-4">
          <Button
            variant="secondary"
            className="w-full justify-center"
            icon={<Bot />}
          >
            Generate Insights
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Latest Insights</h3>
        <div className="space-y-4">
          {[
            {
              title: 'Sales Trend Analysis',
              description: 'Your electronics category shows 25% growth potential',
              type: 'positive',
            },
            {
              title: 'Inventory Alert',
              description: 'Consider restocking popular items in fashion category',
              type: 'warning',
            },
            {
              title: 'Customer Behavior',
              description: 'Repeat customer rate increased by 12% this month',
              type: 'info',
            },
          ].map((insight, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <h4 className="font-medium text-gray-800">{insight.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
              <div className="flex justify-end mt-2">
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};