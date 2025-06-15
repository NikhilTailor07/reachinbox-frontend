import React, { useState } from 'react';
import { 
  Reply, 
  Forward, 
  Trash2, 
  Archive, 
  Star, 
  MoreHorizontal,
  ChevronLeft,
  Clock
} from 'lucide-react';
import { Thread } from '../types';
import { Button } from './ui/Button';

interface EmailDetailProps {
  thread: Thread;
  onClose?: () => void;
  onReply: () => void;
  onDelete: () => void;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({
  thread,
  onClose,
  onReply,
  onDelete
}) => {
  const [isStarred, setIsStarred] = useState(false);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} icon={ChevronLeft}>
              Back
            </Button>
          )}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" icon={Archive}>
              Archive
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} icon={Trash2}>
              Delete
            </Button>
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => setIsStarred(!isStarred)}
              className={isStarred ? 'text-yellow-500' : ''}
            >
              <Star className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" icon={MoreHorizontal}>
              More
            </Button>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {thread.subject}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {thread.fromName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{thread.fromName}</p>
                  <p className="text-xs">{thread.fromEmail}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatDateTime(thread.sentAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getPriorityBadge(thread.priority)}
            {thread.labels && thread.labels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div 
            dangerouslySetInnerHTML={{ __html: thread.body }}
            className="text-gray-700 dark:text-gray-300 leading-relaxed"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center space-x-3">
          <Button onClick={onReply} icon={Reply}>
            Reply
          </Button>
          <Button variant="secondary" icon={Forward}>
            Forward
          </Button>
        </div>
      </div>
    </div>
  );
};