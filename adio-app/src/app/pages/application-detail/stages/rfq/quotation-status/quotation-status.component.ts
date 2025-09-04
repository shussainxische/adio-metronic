import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../components/ui/icon/icon.component';
import { StatusBadgeComponent, StatusBadgeVariant } from '../../../../../components/ui/status-badge/status-badge.component';
import { ButtonComponent } from '../../../../../components/ui/button/button.component';

export type QuotationStatusType = 'under-approval' | 'awarded' | 'not-awarded' | 'missed-deadline';

export interface QuotationStatusData {
  type: QuotationStatusType;
  submittedAmount?: string;
  submissionDate?: string;
  awardedDate?: string;
  decisionDate?: string;
  rfqDeadline?: string;
  uploadedFileName?: string;
}

@Component({
  selector: 'app-quotation-status',
  standalone: true,
  imports: [CommonModule, IconComponent, StatusBadgeComponent, ButtonComponent],
  templateUrl: './quotation-status.component.html',
  styleUrl: './quotation-status.component.scss'
})
export class QuotationStatusComponent {
  @Input() statusData: QuotationStatusData = { type: 'under-approval' };
  @Output() backToForm = new EventEmitter<void>();
  @Output() startEvaluation = new EventEmitter<void>();

  get statusConfig() {
    const configs = {
      'under-approval': {
        icon: 'clock',
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100',
        title: 'Under Approval',
        description: 'Your quotation is pending approval from the applicant',
        badge: { text: 'Quotation - Under Approval', variant: 'active' as StatusBadgeVariant },
        alertType: 'info',
        alertMessage: 'You will be notified once the applicant reviews and responds to your quotation. No further action is required at this time.',
        showButton: false
      },
      'awarded': {
        icon: 'check-circle',
        iconColor: 'text-green-600',
        iconBg: 'bg-green-100',
        title: 'Quotation',
        description: 'Your quotation was approved by the applicant',
        badge: { text: 'Quotation - Awarded', variant: 'success' as StatusBadgeVariant },
        alertType: null,
        alertMessage: null,
        showButton: false
      },
      'not-awarded': {
        icon: 'x',
        iconColor: 'text-red-600',
        iconBg: 'bg-red-100',
        title: 'Not Awarded',
        description: 'Your quotation was not selected for this project',
        badge: { text: 'Quotation - Not Awarded', variant: 'archived' as StatusBadgeVariant },
        alertType: null,
        alertMessage: null,
        showButton: false
      },
      'missed-deadline': {
        icon: 'alert-triangle',
        iconColor: 'text-gray-600',
        iconBg: 'bg-gray-100',
        title: 'Not Awarded - Missed Deadline',
        description: 'You did not submit a quotation for this Quotation',
        badge: { text: 'Quotation - Not Submitted', variant: 'archived' as StatusBadgeVariant },
        alertType: 'warning',
        alertMessage: 'This opportunity has closed. The deadline for quotation submission has passed.',
        showButton: false
      }
    };
    return configs[this.statusData.type];
  }

  onBackToForm() {
    this.backToForm.emit();
  }

  onStartEvaluation() {
    this.startEvaluation.emit();
  }

  onDownloadFile() {
    console.log('Downloading file:', this.statusData.uploadedFileName || 'Energy_Audit_Proposal.pdf');
  }
}