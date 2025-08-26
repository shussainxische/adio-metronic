import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from '../../../status-badge/status-badge.component';

export interface SummaryData {
  applicationId: string;
  applicationDate: string;
  company: string;
  type: string;
  services: string[];
  deadline: string;
  assignedTo: string;
  progress: number;
  currentStep: string;
  status: string;
  statusVariant: 'success' | 'pending' | 'warning' | 'archived' | 'active' | 'category';
}

@Component({
  selector: 'app-summary-widget',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  templateUrl: './summary-widget.component.html',
  styleUrl: './summary-widget.component.scss'
})
export class SummaryWidgetComponent {
  @Input() data!: SummaryData;
}