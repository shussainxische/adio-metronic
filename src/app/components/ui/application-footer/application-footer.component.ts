import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-application-footer',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 group">
        <app-icon [name]="getAssigneeIcon()" [size]="20" className="text-gray-600"></app-icon>
        <span class="text-2xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          {{ assignee }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <app-icon 
          *ngIf="showAlert" 
          name="alert-circle" 
          [size]="20" 
          className="text-red">
        </app-icon>
        <div class="relative">
          <app-icon name="bell" [size]="16" className="text-black"></app-icon>
          <div 
            *ngIf="hasNotifications"
            class="absolute -top-1 -right-1 w-2 h-2 bg-red rounded-full">
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './application-footer.component.scss'
})
export class ApplicationFooterComponent {
  @Input() certifyingBody: string = 'Abu Dhabi Certification Body';
  @Input() showAlert: boolean = false;
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