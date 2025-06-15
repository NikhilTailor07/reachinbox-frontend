import React, { useState, useEffect } from 'react';
import {
  Mail,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  Users
} from 'lucide-react';
import { EmailAnalytics } from '../types';
import { analyticsAPI } from '../services/api';

export const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<EmailAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsAPI.getEmailAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <p>Unable to load analytics data</p>
      </div>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    changeType = 'positive' 
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${
              changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
              changeType === 'negative' ? 'text-red-600 dark:text-red-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  );

  const categoryData = [
    { name: 'Work', value: analytics.categories.work, color: 'bg-blue-500' },
    { name: 'Personal', value: analytics.categories.personal, color: 'bg-green-500' },
    { name: 'Newsletter', value: analytics.categories.newsletter, color: 'bg-yellow-500' },
    { name: 'Spam', value: analytics.categories.spam, color: 'bg-red-500' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Insights into your email productivity and patterns
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Emails"
          value={analytics.totalEmails.toLocaleString()}
          icon={Mail}
          change="+12% from last week"
          changeType="positive"
        />
        <StatCard
          title="Unread Count"
          value={analytics.unreadCount}
          icon={TrendingUp}
          change="-23% from yesterday"
          changeType="positive"
        />
        <StatCard
          title="Today's Emails"
          value={analytics.todayCount}
          icon={Calendar}
          change="+5 from yesterday"
          changeType="positive"
        />
        <StatCard
          title="Avg Response Time"
          value={`${analytics.responseTime}h`}
          icon={Clock}
          change="-30min improvement"
          changeType="positive"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Score */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Productivity Score
            </h3>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                  className="dark:stroke-gray-600"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray={`${analytics.productivityScore}, ${100 - analytics.productivityScore}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.productivityScore}%
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Great job! You're responding faster than usual.
          </p>
        </div>

        {/* Email Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Email Categories
            </h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {categoryData.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {category.value}%
                  </span>
                  <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${category.color} transition-all duration-300`}
                      style={{ width: `${category.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Email Activity Timeline
          </h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {[
            { time: '9:00 AM', action: 'Replied to Sarah Connor', type: 'reply' },
            { time: '10:30 AM', action: 'Received 3 new emails', type: 'received' },
            { time: '11:45 AM', action: 'Archived newsletter emails', type: 'archive' },
            { time: '2:15 PM', action: 'Sent project update', type: 'sent' },
            { time: '4:30 PM', action: 'Deleted spam messages', type: 'delete' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">{activity.action}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs ${
                activity.type === 'reply' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                activity.type === 'received' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                activity.type === 'sent' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                activity.type === 'archive' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {activity.type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};