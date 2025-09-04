import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  statusVariant: 'success' | 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'app-summary-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-widget.component.html',
  styleUrl: './summary-widget.component.scss'
})
export class SummaryWidgetComponent {
  @Input() data!: SummaryData;
  @Input() title: string = 'Application Summary';
}