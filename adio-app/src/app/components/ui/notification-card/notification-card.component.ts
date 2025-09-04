import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'alert' | 'application';
  isRead: boolean;
  timestamp: Date;
  isActionable?: boolean;
}

@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div 
      class="notification-card"
      [class.unread]="!notification.isRead"
      (click)="onCardClick()">
      
      <div class="notification-content">
        <div class="notification-header">
          <app-icon 
            [name]="getTypeIcon()" 
            [size]="16" 
            [className]="getIconColor()">
          </app-icon>
          
          <div class="notification-text">
            <p class="notification-message" [innerHTML]="getFormattedMessage()"></p>
            <span class="notification-time">{{ getTimeAgo() }}</span>
          </div>
        </div>
      </div>
      
      <div class="notification-actions">
        <button 
          *ngIf="!notification.isRead"
          (click)="onMarkAsRead($event)"
          class="mark-read-btn">
          Mark as read
        </button>
        <app-icon 
          *ngIf="notification.isActionable && notification.isRead" 
          name="chevron-right" 
          [size]="16" 
          className="text-gray-400">
        </app-icon>
      </div>
    </div>
  `,
  styleUrl: './notification-card.component.scss'
})
export class NotificationCardComponent {
  @Input() notification!: NotificationData;
  @Output() cardClick = new EventEmitter<NotificationData>();
  @Output() markAsRead = new EventEmitter<NotificationData>();

  onCardClick() {
    this.cardClick.emit(this.notification);
  }

  onMarkAsRead(event: Event) {
    event.stopPropagation();
    this.markAsRead.emit(this.notification);
  }

  getTypeIcon(): string {
    switch (this.notification.type) {
      case 'system': return 'settings';
      case 'alert': return 'alert-triangle';
      case 'application': return 'file-text';
      default: return 'info';
    }
  }

  getIconColor(): string {
    if (this.notification.isRead) {
      return 'text-gray-400';
    }
    
    switch (this.notification.type) {
      case 'system': return 'text-blue-600';
      case 'alert': return 'text-orange-600';
      case 'application': return 'text-primary';
      default: return 'text-gray-600';
    }
  }

  getFormattedMessage(): string {
    // Combine title and message into single text and make application IDs bold 
    const fullMessage = `${this.notification.title}. ${this.notification.message}`;
    return fullMessage.replace(/(ESP\d+)/g, '<strong>$1</strong>');
  }

  getTimeAgo(): string {
    const now = new Date();
    const notifDate = new Date(this.notification.timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notifDate.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // Today
    if (diffInDays === 0) {
      if (diffInMinutes < 1) return 'now';
      if (diffInMinutes < 60) return `${diffInMinutes}m`;
      return `${diffInHours}h`;
    }
    
    // Yesterday
    if (diffInDays === 1) return 'yesterday';
    
    // Last Week (2-6 days ago)
    if (diffInDays <= 6) return `${diffInDays}d`;
    
    // Last Month (1-4 weeks ago)
    if (diffInDays <= 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? '1w' : `${weeks}w`;
    }
    
    // Previous months - show month name
    const currentYear = now.getFullYear();
    const notifYear = notifDate.getFullYear();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (currentYear === notifYear) {
      // Same year - just month and day
      return `${monthNames[notifDate.getMonth()]} ${notifDate.getDate()}`;
    } else {
      // Different year - include year
      return `${monthNames[notifDate.getMonth()]} ${notifDate.getDate()}, ${notifYear}`;
    }
  }
}