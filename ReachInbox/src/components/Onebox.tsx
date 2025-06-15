import React, { useState, useEffect, useCallback } from 'react';
import { Thread } from '../types';
import { emailAPI } from '../services/api';
import { EmailList } from './EmailList';
import { EmailDetail } from './EmailDetail';
import { EmailEditor } from './EmailEditor';

export const Onebox: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const fetchThreads = useCallback(async () => {
    try {
      setLoading(true);
      const threadsData = await emailAPI.getThreads();
      setThreads(threadsData);
    } catch (error) {
      console.error('Failed to fetch threads:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'd':
          if (selectedThread) {
            handleDeleteThread(selectedThread.id);
          }
          break;
        case 'r':
          if (selectedThread) {
            setIsReplyOpen(true);
          }
          break;
        case 'escape':
          setIsReplyOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedThread]);

  const handleThreadSelect = async (thread: Thread) => {
    try {
      const fullThread = await emailAPI.getThread(thread.id);
      setSelectedThread(fullThread);
      
      // Mark as read
      if (!thread.isRead) {
        setThreads(prev => 
          prev.map(t => t.id === thread.id ? { ...t, isRead: true } : t)
        );
      }
    } catch (error) {
      console.error('Failed to fetch thread:', error);
      setSelectedThread(thread);
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    try {
      await emailAPI.deleteThread(threadId);
      setThreads(prev => prev.filter(t => t.id !== threadId));
      
      if (selectedThread?.id === threadId) {
        setSelectedThread(null);
      }
    } catch (error) {
      console.error('Failed to delete thread:', error);
    }
  };

  const handleReply = async (content: { subject: string; body: string }) => {
    if (!selectedThread) return;

    try {
      await emailAPI.sendReply(selectedThread.id, {
        from: 'user@example.com', // This would come from auth context
        to: selectedThread.fromEmail,
        subject: content.subject.startsWith('Re:') ? content.subject : `Re: ${content.subject}`,
        body: content.body
      });
      
      setIsReplyOpen(false);
      // Optionally refresh threads or show success message
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Email List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Inbox ({threads.filter(t => !t.isRead).length})
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {threads.length} total emails
          </p>
        </div>
        <EmailList
          threads={threads}
          selectedThreadId={selectedThread?.id}
          onThreadSelect={handleThreadSelect}
        />
      </div>

      {/* Email Detail */}
      <div className="flex-1 flex flex-col">
        {selectedThread ? (
          <EmailDetail
            thread={selectedThread}
            onReply={() => setIsReplyOpen(true)}
            onDelete={() => handleDeleteThread(selectedThread.id)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No email selected</h3>
              <p className="text-sm">Choose an email from the list to view its contents</p>
              <div className="mt-4 text-xs space-y-1">
                <p><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">D</kbd> Delete selected email</p>
                <p><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">R</kbd> Reply to selected email</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      <EmailEditor
        isOpen={isReplyOpen}
        onClose={() => setIsReplyOpen(false)}
        onSend={handleReply}
        initialSubject={selectedThread ? `Re: ${selectedThread.subject}` : ''}
        toEmail={selectedThread?.fromEmail}
      />
    </div>
  );
};