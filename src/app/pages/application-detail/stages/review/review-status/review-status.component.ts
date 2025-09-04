import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../components/ui/icon/icon.component';
import { StatusBadgeComponent, StatusBadgeVariant } from '../../../../../components/ui/status-badge/status-badge.component';
import { ButtonComponent } from '../../../../../components/ui/button/button.component';

export type ReviewStatusType = 'submitted' | 'under-review' | 'approved' | 'rejected';

export interface ReviewStatusData {
  type: ReviewStatusType;
  submissionDate?: string;
  submissionId?: string;
  rejectionReason?: string;
}

@Component({
  selector: 'app-review-status',
  standalone: true,
  imports: [CommonModule, IconComponent, StatusBadgeComponent, ButtonComponent],
  templateUrl: './review-status.component.html',
  styleUrl: './review-status.component.scss'
})
export class ReviewStatusComponent {
  @Input() statusData: ReviewStatusData = { type: 'under-review' };
  @Output() backToForm = new EventEmitter<void>();

  get statusConfig() {
    const configs = {
      'submitted': {
        icon: 'clock',
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100',
        title: 'Under Review',
        description: 'Your evaluation is currently being reviewed by ADIO',
        badge: { text: 'Review - Submitted', variant: 'active' as StatusBadgeVariant },
        alertType: 'info',
        alertMessage: 'Your evaluation has been submitted for review. We will notify you once the review is complete.',
        showButton: false
      },
      'under-review': {
        icon: 'clock',
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100',
        title: 'Under Review',
        description: 'Your evaluation is currently being reviewed by ADIO',
        badge: { text: 'Review - In Progress', variant: 'active' as StatusBadgeVariant },
        alertType: 'info',
        alertMessage: 'Your evaluation is currently being reviewed. We will notify you once the review is complete.',
        showButton: false
      },
      'approved': {
        icon: 'check-circle',
        iconColor: 'text-green-600',
        iconBg: 'bg-green-100',
        title: 'Review Approved',
        description: 'Your evaluation has been approved and certified',
        badge: { text: 'Review - Approved', variant: 'success' as StatusBadgeVariant },
        alertType: 'success',
        alertMessage: 'Congratulations! Your evaluation has been approved and your certificate has been issued.',
        showButton: false
      },
      'rejected': {
        icon: 'x-circle',
        iconColor: 'text-red-600',
        iconBg: 'bg-red-100',
        title: 'Review Rejected',
        description: 'Your evaluation has been rejected',
        badge: { text: 'Closed - Rejected', variant: 'archived' as StatusBadgeVariant },
        alertType: null,
        alertMessage: null,
        showButton: false
      }
    };
    return configs[this.statusData.type];
  }

  onBackToForm() {
    this.backToForm.emit();
  }
}