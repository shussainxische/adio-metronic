import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../../../../../../components/ui/icon/icon.component';
import { StatusBadgeComponent } from '../../../../../../../../../../components/ui/status-badge/status-badge.component';
import { ButtonComponent } from '../../../../../../../../../../components/ui/button/button.component';

export interface EvaluationStatusData {
  type: 'submitted' | 'under-review' | 'approved' | 'rejected';
  submissionDate: string;
  submissionId: string;
  uploadedFiles?: string[];
}

@Component({
  selector: 'app-evaluation-status',
  standalone: true,
  imports: [CommonModule, IconComponent, StatusBadgeComponent, ButtonComponent],
  templateUrl: './evaluation-status.component.html',
  styleUrl: './evaluation-status.component.scss'
})
export class EvaluationStatusComponent {
  @Input() statusData!: EvaluationStatusData;
  @Output() backToForm = new EventEmitter<void>();

  get statusConfig() {
    switch (this.statusData.type) {
      case 'submitted':
        return {
          icon: 'check-circle',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          title: 'Evaluation Submitted Successfully',
          description: 'Your application is now under review with ADIO.',
          badge: { text: 'Submitted', variant: 'success' as const },
          alertType: 'success' as const,
          alertMessage: 'No further action is required at this time. You will be contacted regarding the next steps in the evaluation process.'
        };
      case 'under-review':
        return {
          icon: 'clock',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          title: 'Evaluation Under Review',
          description: 'ADIO is currently reviewing your evaluation submission.',
          badge: { text: 'Under Review', variant: 'pending' as const },
          alertType: 'info' as const,
          alertMessage: 'The review process typically takes 5-10 business days.'
        };
      case 'approved':
        return {
          icon: 'check-circle',
          iconBg: 'bg-green-100', 
          iconColor: 'text-green-600',
          title: 'Evaluation Approved',
          description: 'Your evaluation has been approved by ADIO.',
          badge: { text: 'Approved', variant: 'success' as const },
          alertType: 'success' as const,
          alertMessage: 'Congratulations! Your application has been approved for the ADIO Energy Support Program.'
        };
      case 'rejected':
        return {
          icon: 'x-circle',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          title: 'Evaluation Rejected',
          description: 'Your evaluation has been rejected by ADIO.',
          badge: { text: 'Rejected', variant: 'archived' as const },
          alertType: 'warning' as const,
          alertMessage: 'Please review the feedback and consider resubmitting with the requested changes.'
        };
      default:
        return {
          icon: 'clock',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          title: 'Status Unknown',
          description: 'Please contact support for assistance.',
          badge: { text: 'Unknown', variant: 'pending' as const },
          alertType: 'info' as const,
          alertMessage: ''
        };
    }
  }

  onBackToForm(): void {
    this.backToForm.emit();
  }

  onDownloadFile(): void {
    // TODO: Implement file download functionality
    console.log('Download file clicked');
  }
}