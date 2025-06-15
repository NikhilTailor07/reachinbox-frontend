import { Thread, ReplyData, EmailAnalytics } from '../types';

const API_BASE_URL = 'https://hiring.reachinbox.xyz/api/v1';

// Mock token for development - in production this would come from authentication
const getAuthToken = () => localStorage.getItem('authToken') || 'your-auth-token';

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};

export const authAPI = {
  googleLogin: async () => {
    // Mock implementation - in production this would handle OAuth flow
    const mockUser = {
      email: 'user@example.com',
      name: 'John Doe',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
    };
    
    localStorage.setItem('authToken', 'mock-token-12345');
    return mockUser;
  }
};

export const emailAPI = {
  getThreads: async (): Promise<Thread[]> => {
    try {
      const response = await apiRequest('/onebox/list');
      return response.data || [];
    } catch (error) {
      // Mock data for development
      return [
        {
          id: '1',
          fromEmail: 'sarah.connor@techcorp.com',
          fromName: 'Sarah Connor',
          subject: 'Q4 Marketing Strategy Review',
          body: '<p>Hi team,</p><p>I wanted to discuss our Q4 marketing strategy and get everyone\'s input on the proposed campaigns. Please review the attached documents and let me know your thoughts.</p><p>Best regards,<br>Sarah</p>',
          sentAt: new Date().toISOString(),
          isRead: false,
          priority: 'high',
          labels: ['work', 'marketing']
        },
        {
          id: '2',
          fromEmail: 'newsletter@techcrunch.com',
          fromName: 'TechCrunch',
          subject: 'Daily Tech News Digest',
          body: '<p>Your daily dose of tech news is here! Check out today\'s top stories in technology and startups.</p>',
          sentAt: new Date(Date.now() - 3600000).toISOString(),
          isRead: true,
          priority: 'low',
          labels: ['newsletter']
        },
        {
          id: '3',
          fromEmail: 'john.smith@company.com',
          fromName: 'John Smith',
          subject: 'Project Deadline Update',
          body: '<p>Hello,</p><p>I wanted to update you on the project timeline. We\'re making good progress but may need an extension of 2-3 days.</p><p>Thanks,<br>John</p>',
          sentAt: new Date(Date.now() - 7200000).toISOString(),
          isRead: false,
          priority: 'medium',
          labels: ['work', 'urgent']
        }
      ];
    }
  },

  getThread: async (threadId: string): Promise<Thread> => {
    try {
      const response = await apiRequest(`/onebox/${threadId}`);
      return response.data;
    } catch (error) {
      // Mock data for development
      const threads = await emailAPI.getThreads();
      const thread = threads.find(t => t.id === threadId);
      if (!thread) throw new Error('Thread not found');
      return thread;
    }
  },

  deleteThread: async (threadId: string): Promise<void> => {
    try {
      await apiRequest(`/onebox/${threadId}`, { method: 'DELETE' });
    } catch (error) {
      // Mock success for development
      console.log(`Deleted thread ${threadId}`);
    }
  },

  sendReply: async (threadId: string, replyData: ReplyData): Promise<void> => {
    try {
      await apiRequest(`/reply/${threadId}`, {
        method: 'POST',
        body: JSON.stringify(replyData),
      });
    } catch (error) {
      // Mock success for development
      console.log('Reply sent:', replyData);
    }
  }
};

export const analyticsAPI = {
  getEmailAnalytics: async (): Promise<EmailAnalytics> => {
    // Mock analytics data
    return {
      totalEmails: 1247,
      unreadCount: 23,
      todayCount: 18,
      responseTime: 2.3,
      productivityScore: 87,
      categories: {
        work: 65,
        personal: 20,
        newsletter: 10,
        spam: 5
      }
    };
  }
};