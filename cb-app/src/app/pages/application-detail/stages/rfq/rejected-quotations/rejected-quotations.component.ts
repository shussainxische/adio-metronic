import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface RejectedQuotation {
  cbName: string;
  amount?: string;
  submissionDate?: string;
  status: 'submitted' | 'pending';
}

@Component({
  selector: 'app-rejected-quotations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rejected-quotations.component.html',
  styleUrl: './rejected-quotations.component.scss'
})
export class RejectedQuotationsComponent {
  @Input() rejectedQuotations: RejectedQuotation[] = [];

  viewProposal(cbName: string): void {
    console.log(`Viewing proposal for ${cbName}`);
    // In a real app, this would open/download the proposal document
  }
}