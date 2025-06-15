export interface Thread {
  id: string;
  fromEmail: string;
  fromName: string;
  subject: string;
  body: string;
  sentAt: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  labels: string[];
}

export interface User {
  email: string;
  name: string;
  avatar?: string;
}

export interface ReplyData {
  from: string;
  to: string;
  subject: string;
  body: string;
}

export interface EmailAnalytics {
  totalEmails: number;
  unreadCount: number;
  todayCount: number;
  responseTime: number;
  productivityScore: number;
  categories: {
    work: number;
    personal: number;
    newsletter: number;
    spam: number;
  };
}