import { TrendingUp, Brain, LineChart, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function PredictionInsights() {
  const insights = [
    {
      title: "Sales Forecast",
      prediction: "+12% expected growth",
      description: "Based on historical trends and market conditions",
      trend: "up",
      confidence: 85,
      icon: TrendingUp
    },
    {
      title: "Inventory Optimization",
      prediction: "3 items need restocking",
      description: "AI suggests optimal stock levels",
      trend: "down",
      confidence: 92,
      icon: LineChart
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-600">AI-Powered Insights</span>
        </div>
        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
          Updated just now
        </span>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.title}
            className="p-4 rounded-xl bg-gradient-to-br from-white to-indigo-50/30 border border-indigo-100 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-medium text-gray-900">{insight.title}</h4>
                <div className="flex items-center space-x-2">
                  {insight.trend === 'up' ? (
                    <ArrowUpCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownCircle className="w-4 h-4 text-red-500" />
                  )}
                  <p className="text-sm font-medium text-gray-600">{insight.prediction}</p>
                </div>
                <p className="text-xs text-gray-500">{insight.description}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs font-medium text-indigo-600 mb-1">
                  {insight.confidence}% confidence
                </div>
                <div className="w-16 h-1 bg-gray-200 rounded">
                  <div
                    className="h-full bg-indigo-600 rounded"
                    style={{ width: `${insight.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-2">
        <Brain className="w-4 h-4" />
        <span>Generate More Insights</span>
      </button>
    </div>
  );
}
