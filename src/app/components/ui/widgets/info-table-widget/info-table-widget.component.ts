import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';
import { ProgressBarComponent } from '../../progress-bar/progress-bar.component';
import { StatusBadgeComponent, StatusBadgeVariant } from '../../status-badge/status-badge.component';

export interface InfoTableRow {
  label: string;
  value: string | string[];
  type?: 'text' | 'status-badge' | 'status-badges' | 'progress' | 'compliance';
  statusVariant?: StatusBadgeVariant;
  progress?: number;
  allowWrap?: boolean;
}

export interface InfoTableData {
  title: string;
  headerBadge?: {
    text: string;
    variant: 'success' | 'warning' | 'danger' | 'info';
  };
  rows: InfoTableRow[];
}

@Component({
  selector: 'app-info-table-widget',
  standalone: true,
  imports: [CommonModule, IconComponent, ProgressBarComponent, StatusBadgeComponent],
  templateUrl: './info-table-widget.component.html',
  styleUrl: './info-table-widget.component.scss'
})
export class InfoTableWidgetComponent {
  @Input() data!: InfoTableData;
  @Input() collapsed: boolean = false;
  @Input() onToggle?: () => void; // Callback for external toggle handling
  
  toggleCollapsed() {
    if (this.onToggle) {
      this.onToggle(); // Use external handler for accordion behavior
    } else {
      this.collapsed = !this.collapsed; // Fallback to internal state
    }
  }
  
  getStringValue(value: string | string[]): string {
    return Array.isArray(value) ? value[0] : value;
  }
  
  getArrayValue(value: string | string[]): string[] {
    return Array.isArray(value) ? value : [value];
  }
}