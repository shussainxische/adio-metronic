import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../components/ui/page-header/page-header.component';
import { IconComponent } from '../../components/ui/icon/icon.component';
import { TablePaginationComponent } from '../../components/ui/table/table-pagination/table-pagination.component';
import { NotificationCardComponent, NotificationData } from '../../components/ui/notification-card/notification-card.component';
import { TabNavigationComponent, Tab } from '../../components/ui/tab-navigation/tab-navigation.component';
import { TableNoDataComponent } from '../../components/ui/table/table/table-no-data/table-no-data.component';
import { NotificationService } from '../../services/notification.service';


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

  notifications: NotificationData[] = [];
  filteredNotifications: NotificationData[] = [];
  paginatedNotifications: NotificationData[] = [];
  
  // Pagination
  currentPage: number = 1;
  perPage: number = 10;
  totalItems: number = 0;

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  ngOnInit() {
    this.notifications = this.notificationService.getNotifications();
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
    this.notificationService.markAsRead(notification.id);
    this.notifications = this.notificationService.getNotifications(); // Refresh local copy
    this.filterByTab(); // Refresh filtered list after marking as read
    this.updatePagination();
    
    // Navigate to application detail page if notification is related to an application
    if (notification.applicationId && notification.isActionable) {
      this.navigateToApplicationDetail(notification.applicationId);
    } else {
      console.log('Notification clicked:', notification);
    }
  }

  private navigateToApplicationDetail(applicationId: string) {
    // Navigate to application detail page
    this.router.navigate(['/applications', applicationId]).then(() => {
      console.log(`Navigated to application detail page for ID: ${applicationId}`);
    }).catch(error => {
      console.error('Navigation failed:', error);
    });
  }

  onMarkAsRead(notification: NotificationData) {
    this.notificationService.markAsRead(notification.id);
    this.notifications = this.notificationService.getNotifications(); // Refresh local copy
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