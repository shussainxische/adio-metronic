import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../icon/icon.component';

export interface SLAData {
  daysLeft: number;
  status: 'warning' | 'danger' | 'normal';
  message: string;
}

@Component({
  selector: 'app-sla-compliance-widget',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './sla-compliance-widget.component.html',
  styleUrl: './sla-compliance-widget.component.scss'
})
export class SLAComplianceWidgetComponent {
  @Input() data!: SLAData;
  @Input() isCollapsed: boolean = false;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  getStatusColor(): string {
    switch (this.data.status) {
      case 'danger':
        return 'text-red-600';
      case 'warning':
        return 'text-orange-600';
      default:
        return 'text-green-600';
    }
  }

  getBackgroundColor(): string {
    switch (this.data.status) {
      case 'danger':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  }

  getIconName(): string {
    switch (this.data.status) {
      case 'danger':
      case 'warning':
        return 'triangle-exclamation';
      default:
        return 'check-circle';
    }
  }
}