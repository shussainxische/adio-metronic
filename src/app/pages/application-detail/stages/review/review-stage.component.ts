import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../components/ui/icon/icon.component';
import { StatusBadgeComponent } from '../../../../components/ui/status-badge/status-badge.component';

export interface EntityReview {
  name: string;
  status: 'submitted' | 'pending' | 'approved' | 'rejected';
}

@Component({
  selector: 'app-review-stage',
  standalone: true,
  imports: [CommonModule, IconComponent, StatusBadgeComponent],
  templateUrl: './review-stage.component.html',
  styleUrl: './review-stage.component.scss'
})
export class ReviewStageComponent {
  entityReviews: EntityReview[] = [
    {
      name: 'TAQA Review',
      status: 'submitted'
    },
    {
      name: 'AD Ports Review', 
      status: 'pending'
    }
  ];

  getStatusVariant(status: string): string {
    switch (status) {
      case 'submitted': return 'success';
      case 'approved': return 'success';
      case 'pending': return 'pending';
      case 'rejected': return 'archived';
      default: return 'pending';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'submitted': return 'Submitted';
      case 'approved': return 'Approved';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  }
}