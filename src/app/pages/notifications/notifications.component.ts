import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../components/ui/page-header/page-header.component';
import { IconComponent } from '../../components/ui/icon/icon.component';
import { TablePaginationComponent } from '../../components/ui/table/table-pagination/table-pagination.component';
import { NotificationCardComponent, NotificationData } from '../../components/ui/notification-card/notification-card.component';
import { TabNavigationComponent, Tab } from '../../components/ui/tab-navigation/tab-navigation.component';
import { TableNoDataComponent } from '../../components/ui/table/table/table-no-data/table-no-data.component';


@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageHeaderComponent, IconComponent, TablePaginationComponent, NotificationCardComponent, TabNavigationComponent, TableNoDataComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  // Tab configuration
  tabs: Tab[] = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'read', label: 'Read' }
  ];
  activeTabId: string = 'all';

  notifications: NotificationData[] = [
    {
      id: '1',
      title: 'Application ESP001 Status Update',
      message: 'Your application has moved to Evaluation stage.',
      type: 'application',
      isRead: false,
      timestamp: new Date('2025-01-20T10:30:00'),
      isActionable: true
    },
    {
      id: '2',
      title: 'Document Submission Required',
      message: 'Additional financial documents required for ESP002.',
      type: 'alert',
      isRead: false,
      timestamp: new Date('2025-01-19T14:45:00'),
      isActionable: true
    },
    {
      id: '3',
      title: 'Application ESP013 Certified',
      message: 'Your application has been successfully certified.',
      type: 'application',
      isRead: true,
      timestamp: new Date('2025-01-18T09:15:00'),
      isActionable: true
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
      message: 'ESP005 review deadline approaching.',
      type: 'alert',
      isRead: true,
      timestamp: new Date('2025-01-16T11:20:00'),
      isActionable: true
    }
  ];

  filteredNotifications: NotificationData[] = [...this.notifications];
  paginatedNotifications: NotificationData[] = [];
  
  // Pagination
  currentPage: number = 1;
  perPage: number = 10;
  totalItems: number = 0;

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  ngOnInit() {
    this.filterByTab();
    this.updatePagination();
  }

  onTabSelected(tabId: string) {
    this.activeTabId = tabId;
    this.currentPage = 1;
    this.filterByTab();
    this.updatePagination();
  }

  onNotificationClick(notification: NotificationData) {
    if (!notification.isRead) {
      notification.isRead = true;
      this.filterByTab(); // Refresh filtered list after marking as read
      this.updatePagination();
    }
    console.log('Notification clicked:', notification);
  }

  onMarkAsRead(notification: NotificationData) {
    notification.isRead = true;
    this.filterByTab(); // Refresh filtered list after marking as read
    this.updatePagination();
  }

  private filterByTab() {
    let filtered: NotificationData[] = [];
    
    switch (this.activeTabId) {
      case 'unread':
        filtered = this.notifications.filter(n => !n.isRead);
        break;
      case 'read':
        filtered = this.notifications.filter(n => n.isRead);
        break;
      default: // 'all'
        filtered = [...this.notifications];
        break;
    }
    
    // Sort by newest first (most recent timestamp first)
    this.filteredNotifications = filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    });
    
    this.totalItems = this.filteredNotifications.length;
  }

  private updatePagination() {
    const startIndex = (this.currentPage - 1) * this.perPage;
    const endIndex = startIndex + this.perPage;
    this.paginatedNotifications = this.filteredNotifications.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  onPerPageChange(perPage: number) {
    this.perPage = perPage;
    this.currentPage = 1;
    this.updatePagination();
  }
}