import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../components/ui/page-header/page-header.component';
import { IconComponent } from '../../components/ui/icon/icon.component';
import { StatusBadgeComponent } from '../../components/ui/status-badge/status-badge.component';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  isRead: boolean;
  timestamp: Date;
  applicationId?: string;
  actionRequired?: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageHeaderComponent, IconComponent, StatusBadgeComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  notifications: Notification[] = [
    {
      id: '1',
      title: 'Application ESP001 Status Update',
      message: 'Your application has moved to Evaluation stage. Review required documents have been uploaded.',
      type: 'info',
      isRead: false,
      timestamp: new Date('2025-01-20T10:30:00'),
      applicationId: 'ESP001',
      actionRequired: false
    },
    {
      id: '2',
      title: 'Document Submission Required',
      message: 'Additional financial documents are required for application ESP002. Please submit before the deadline.',
      type: 'warning',
      isRead: false,
      timestamp: new Date('2025-01-19T14:45:00'),
      applicationId: 'ESP002',
      actionRequired: true
    },
    {
      id: '3',
      title: 'Application ESP013 Certified',
      message: 'Congratulations! Your application has been successfully certified and approved.',
      type: 'success',
      isRead: true,
      timestamp: new Date('2025-01-18T09:15:00'),
      applicationId: 'ESP013',
      actionRequired: false
    },
    {
      id: '4',
      title: 'System Maintenance Scheduled',
      message: 'The system will undergo maintenance on January 25, 2025 from 2:00 AM to 4:00 AM.',
      type: 'system',
      isRead: false,
      timestamp: new Date('2025-01-17T16:00:00'),
      actionRequired: false
    },
    {
      id: '5',
      title: 'Application Deadline Approaching',
      message: 'Application ESP005 review deadline is approaching. Please complete your review by January 22, 2025.',
      type: 'warning',
      isRead: true,
      timestamp: new Date('2025-01-16T11:20:00'),
      applicationId: 'ESP005',
      actionRequired: true
    },
    {
      id: '6',
      title: 'New Resource Available',
      message: 'Updated ESP Application Guidelines (v2.1) are now available in the Resources section.',
      type: 'info',
      isRead: true,
      timestamp: new Date('2025-01-15T13:30:00'),
      actionRequired: false
    }
  ];

  selectedFilter = 'all';
  filteredNotifications: Notification[] = [...this.notifications];

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  get filterOptions() {
    return [
      { value: 'all', label: 'All', count: this.notifications.length },
      { value: 'unread', label: 'Unread', count: this.unreadCount },
      { value: 'action', label: 'Action Required', count: this.notifications.filter(n => n.actionRequired).length },
      { value: 'applications', label: 'Applications', count: this.notifications.filter(n => n.applicationId).length }
    ];
  }

  ngOnInit() {
    this.filterNotifications('all');
  }

  filterNotifications(filter: string) {
    this.selectedFilter = filter;
    
    switch (filter) {
      case 'unread':
        this.filteredNotifications = this.notifications.filter(n => !n.isRead);
        break;
      case 'action':
        this.filteredNotifications = this.notifications.filter(n => n.actionRequired);
        break;
      case 'applications':
        this.filteredNotifications = this.notifications.filter(n => n.applicationId);
        break;
      default:
        this.filteredNotifications = [...this.notifications];
    }
  }

  markAsRead(notification: Notification) {
    notification.isRead = true;
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.isRead = true);
    this.filterNotifications(this.selectedFilter);
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'check-circle';
      case 'warning': return 'alert-triangle';
      case 'error': return 'alert-circle';
      case 'system': return 'settings';
      default: return 'info';
    }
  }

  getNotificationVariant(type: string): 'success' | 'warning' | 'pending' | 'active' {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'warning';
      default: return 'active';
    }
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  }

  navigateToApplication(applicationId?: string) {
    if (applicationId) {
      // Navigate to application detail
      console.log('Navigating to application:', applicationId);
    }
  }

  getEmptyStateMessage(): string {
    switch (this.selectedFilter) {
      case 'unread':
        return 'All notifications have been read.';
      case 'action':
        return 'No actions are required at this time.';
      case 'applications':
        return 'No application-related notifications.';
      default:
        return 'You don\'t have any notifications yet.';
    }
  }
}