import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../components/ui/icon/icon.component';
import { StatusBadgeComponent, StatusBadgeVariant } from '../../../../components/ui/status-badge/status-badge.component';
import { Application } from '../../../../services/application-status.service';

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
export class ReviewStageComponent implements OnInit {
  @Input() application?: Application;
  
  entityReviews: EntityReview[] = [
    {
      name: 'Initial Review',
      status: 'pending'
    },
    {
      name: 'TAQA Review',
      status: 'pending'
    },
    {
      name: 'AD Ports Review', 
      status: 'pending'
    },
    {
      name: 'Final Review',
      status: 'pending'
    }
  ];

  ngOnInit() {
    this.setReviewStatuses();
  }

  private setReviewStatuses() {
    if (!this.application) return;

    // Set statuses based on application status
    switch (this.application.status) {
      case 'Initial Review':
        // Initial review: everything pending
        break;
        
      case 'External Review':
        // External review: Initial and TAQA done, AD Ports and Final pending
        this.entityReviews[0].status = 'submitted'; // Initial Review
        this.entityReviews[1].status = 'submitted'; // TAQA Review
        break;
        
      case 'Final Review':
        // Final review: Initial, TAQA, and AD Ports done, Final pending
        this.entityReviews[0].status = 'submitted'; // Initial Review
        this.entityReviews[1].status = 'submitted'; // TAQA Review
        this.entityReviews[2].status = 'submitted'; // AD Ports Review
        break;
        
      default:
        // Keep all as pending for other statuses
        break;
    }
  }

  getStatusVariant(status: string): StatusBadgeVariant {
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