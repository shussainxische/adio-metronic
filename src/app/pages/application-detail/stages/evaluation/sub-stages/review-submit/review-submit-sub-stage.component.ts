import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadComponent } from '../../../../../../components/ui/file-upload/file-upload.component';
import { EvaluationStatusComponent, EvaluationStatusData } from './evaluation-status/evaluation-status.component';

@Component({
  selector: 'app-review-submit-sub-stage',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent, EvaluationStatusComponent],
  templateUrl: './review-submit-sub-stage.component.html',
  styleUrl: './review-submit-sub-stage.component.scss'
})
export class ReviewSubmitSubStageComponent {
  @Input() readOnly: boolean = false;
  uploadedFiles: File[] = [];
  confirmSubmission = false;
  isSubmitting = false;
  isSubmitted = false;
  submissionId = '';
  submissionDate = new Date();
  statusData!: EvaluationStatusData;

  async submitEvaluation(): Promise<void> {
    if (!this.confirmSubmission || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate submission ID
      this.submissionId = 'ADIO-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      this.submissionDate = new Date();
      
      // Create status data
      this.statusData = {
        type: 'submitted',
        submissionDate: this.submissionDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit', 
          year: 'numeric'
        }),
        submissionId: this.submissionId,
        uploadedFiles: this.uploadedFiles.map(file => file.name)
      };
      
      // Mark as submitted
      this.isSubmitted = true;
      this.isSubmitting = false;
      
      console.log('Evaluation submitted successfully:', {
        submissionId: this.submissionId,
        uploadedFiles: this.uploadedFiles.map(f => ({ name: f.name, size: f.size })),
        submissionDate: this.submissionDate
      });
      
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      alert('There was an error submitting your evaluation. Please try again.');
      this.isSubmitting = false;
    }
  }

  resetForm(): void {
    this.isSubmitted = false;
    this.confirmSubmission = false;
    this.uploadedFiles = [];
  }
}