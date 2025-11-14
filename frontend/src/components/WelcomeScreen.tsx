import React from 'react';
import { TrendingUp, ShoppingBag, Users, BarChart2, Brain } from 'lucide-react';

const WelcomeScreen = () => {
  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 text-indigo-500" />,
      title: "Real-time Analytics",
      description: "Track sales, inventory, and customer metrics in real-time"
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "AI-Powered Insights",
      description: "Get intelligent recommendations and predictions"
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-blue-500" />,
      title: "Smart Dashboards",
      description: "Beautiful, interactive visualizations of your data"
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Customer Intelligence",
      description: "Deep insights into customer behavior and preferences"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to
            <span className="block text-indigo-600">Retail Analytics Platform</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            AI-powered insights, beautiful dashboards, and smart business decisions—all in one place.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <a href="/dashboard" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                Get Started
              </a>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a href="/docs" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                Learn More
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 ring-4 ring-white">
                    {feature.icon}
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <a href="#" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {feature.title}
                    </a>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {feature.description}
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative py-12">
              <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Latest Updates</h3>
                  <div className="mt-4 text-lg text-gray-500">
                    <ul className="space-y-4">
                      <li className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        New AI-powered sales predictions
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        Enhanced customer segmentation
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        Real-time inventory tracking
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-10 lg:mt-0">
                  <h3 className="text-xl font-bold text-gray-900">Analytics Overview</h3>
                  <div className="mt-4 text-lg text-gray-500">
                    <ul className="space-y-4">
                      <li className="flex items-center">
                        <ShoppingBag className="h-5 w-5 text-indigo-500 mr-2" />
                        Track sales performance
                      </li>
                      <li className="flex items-center">
                        <Users className="h-5 w-5 text-indigo-500 mr-2" />
                        Monitor customer engagement
                      </li>
                      <li className="flex items-center">
                        <BarChart2 className="h-5 w-5 text-indigo-500 mr-2" />
                        Analyze market trends
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-10 lg:mt-0">
                  <h3 className="text-xl font-bold text-gray-900">Getting Started</h3>
                  <div className="mt-4 text-lg text-gray-500">
                    <ol className="space-y-4 list-decimal list-inside">
                      <li>Set up your dashboard</li>
                      <li>Import your data</li>
                      <li>Get AI-powered insights</li>
                      <li>Make data-driven decisions</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;