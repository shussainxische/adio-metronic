import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationData } from '../components/ui/notification-card/notification-card.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: NotificationData[] = [
    {
      id: '1',
      title: 'Application ESP-001 Status Update',
      message: 'Your application has moved to Evaluation stage.',
      type: 'application',
      isRead: false,
      timestamp: new Date('2025-01-20T10:30:00'),
      isActionable: true,
      applicationId: '1'
    },
    {
      id: '2',
      title: 'Document Submission Required',
      message: 'Additional financial documents required for ESP-002.',
      type: 'alert',
      isRead: false,
      timestamp: new Date('2025-01-19T14:45:00'),
      isActionable: true,
      applicationId: '2'
    },
    {
      id: '3',
      title: 'Application ESP-013 Certified',
      message: 'Your application has been successfully certified.',
      type: 'application',
      isRead: true,
      timestamp: new Date('2025-01-18T09:15:00'),
      isActionable: true,
      applicationId: '13'
    },
    {
      id: '4',
      title: 'System Maintenance Scheduled',
      message: 'Maintenance on January 25, 2025 from 2:00 AM to 4:00 AM.',
      type: 'system',
      isRead: false,
      timestamp: new Date('2025-01-17T16:00:00'),
      isActionable: false
    },
    {
      id: '5',
      title: 'Application Deadline Approaching',
      message: 'ESP-005 review deadline approaching.',
      type: 'alert',
      isRead: true,
      timestamp: new Date('2025-01-16T11:20:00'),
      isActionable: true,
      applicationId: '5'
    },
    {
      id: '6',
      title: 'Application ESP-007 Requires Action',
      message: 'Your application evaluation form needs completion.',
      type: 'application',
      isRead: false,
      timestamp: new Date('2025-01-15T13:15:00'),
      isActionable: true,
      applicationId: '7'
    },
    {
      id: '7',
      title: 'ESP-016 Certificate Issued',
      message: 'Your application certificate is ready for download.',
      type: 'application',
      isRead: false,
      timestamp: new Date('2025-01-14T16:45:00'),
      isActionable: true,
      applicationId: '16'
    }
  ];

  private unreadCountSubject = new BehaviorSubject<number>(this.getUnreadCount());
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor() {}

  getNotifications(): NotificationData[] {
    return [...this.notifications];
  }

  getUnreadNotifications(): NotificationData[] {
    return this.notifications.filter(n => !n.isRead);
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      notification.isRead = true;
      this.unreadCountSubject.next(this.getUnreadCount());
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
    this.unreadCountSubject.next(0);
  }

  addNotification(notification: NotificationData): void {
    this.notifications.unshift(notification);
    this.unreadCountSubject.next(this.getUnreadCount());
  }

  getRecentNotifications(limit: number = 5): NotificationData[] {
    return this.notifications
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
}