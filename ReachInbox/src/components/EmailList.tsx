import React from 'react';
import { Star, Paperclip, Clock } from 'lucide-react';
import { Thread } from '../types';

interface EmailListProps {
  threads: Thread[];
  selectedThreadId?: string;
  onThreadSelect: (thread: Thread) => void;
}

export const EmailList: React.FC<EmailListProps> = ({
  threads,
  selectedThreadId,
  onThreadSelect
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {threads.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No emails found</p>
            <p className="text-sm">Your inbox is empty or still loading.</p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => onThreadSelect(thread)}
              className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedThreadId === thread.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500'
                  : ''
              } ${!thread.isRead ? 'bg-gray-50/50 dark:bg-gray-800/50' : ''}`}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {thread.fromName.charAt(0).toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h3 className={`text-sm font-medium truncate ${
                        !thread.isRead 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {thread.fromName}
                      </h3>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(thread.priority)}`} />
                    </div>
                    <time className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(thread.sentAt)}
                    </time>
                  </div>

                  <p className={`text-sm mb-2 truncate ${
                    !thread.isRead 
                      ? 'text-gray-900 dark:text-white font-medium' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {thread.subject}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {thread.body.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </p>

                  {/* Labels */}
                  {thread.labels && thread.labels.length > 0 && (
                    <div className="flex items-center space-x-1 mt-2">
                      {thread.labels.slice(0, 2).map((label) => (
                        <span
                          key={label}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {label}
                        </span>
                      ))}
                      {thread.labels.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{thread.labels.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1">
                  <button className="p-1 text-gray-400 hover:text-yellow-500 transition-colors">
                    <Star className="w-4 h-4" />
                  </button>
                  {!thread.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};