import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-assignee-info',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './assignee-info.component.html',
  styleUrl: './assignee-info.component.scss'
})
export class AssigneeInfoComponent {
  @Input() assignee: string = '';
  @Input() hasNotifications: boolean = false;
  @Output() notificationClick = new EventEmitter<void>();

  getAssigneeIcon(): string {
    switch (this.assignee) {
      case 'Certifying Body':
        return 'building';
      case 'Applicant':
        return 'user';
      case 'ADIO':
      case 'TAQA':
      case 'AD Ports':
        return 'building-2';
      default:
        return 'user';
    }
  }

  onNotificationClick(event: Event) {
    event.stopPropagation(); // Prevent row/card click
    this.notificationClick.emit();
  }
}