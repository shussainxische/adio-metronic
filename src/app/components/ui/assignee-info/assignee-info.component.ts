import { Component, Input } from '@angular/core';
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
}