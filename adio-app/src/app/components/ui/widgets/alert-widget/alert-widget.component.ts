import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';

export interface AlertData {
  daysLeft: number;
  status: 'warning' | 'danger' | 'normal';
  message: string;
}

@Component({
  selector: 'app-alert-widget',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './alert-widget.component.html',
  styleUrl: './alert-widget.component.scss'
})
export class AlertWidgetComponent {
  @Input() data!: AlertData;
  @Input() title: string = 'SLA Compliance';
  @Input() collapsed: boolean = true;
  
  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }
  
  get alertIcon(): string {
    switch (this.data.status) {
      case 'danger': return 'alert-circle';
      case 'warning': return 'alert-triangle';
      default: return 'check-circle';
    }
  }
  
  get headerIcon(): string {
    return this.data.status === 'normal' ? 'check-circle' : 'alert-triangle';
  }
  
  get headerIconClass(): string {
    switch (this.data.status) {
      case 'danger': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  }
  
  get alertClass(): string {
    return `alert-${this.data.status}`;
  }
}