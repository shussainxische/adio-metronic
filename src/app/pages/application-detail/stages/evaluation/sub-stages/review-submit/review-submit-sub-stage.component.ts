import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploadComponent } from '../../../../../../components/ui/file-upload/file-upload.component';
import { EvaluationStatusComponent, EvaluationStatusData } from './evaluation-status/evaluation-status.component';
import { IconComponent } from '../../../../../../components/ui/icon/icon.component';
import { Application } from '../../../../../../services/application-status.service';

@Component({
  selector: 'app-review-submit-sub-stage',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent, EvaluationStatusComponent, IconComponent],
  templateUrl: './review-submit-sub-stage.component.html',
  styleUrl: './review-submit-sub-stage.component.scss'
})
export class ReviewSubmitSubStageComponent implements OnInit {
  @Input() readOnly: boolean = false;
  @Input() application?: Application;

  // ADIO View Detection
  isAdioView: boolean = false;
  
  constructor(private router: Router) {}

  ngOnInit() {
    // Detect if we're in ADIO view
    this.isAdioView = this.router.url.startsWith('/adio');
  }

  get showAdioView(): boolean {
    // Show ADIO read-only view when readOnly is true (for CB) or when ADIO is in Review stage
    return this.readOnly || (this.isAdioView && this.application?.stage === 'Review');
  }

  // Sample documents for ADIO view
  get sampleDocuments() {
    return [
      {
        id: '1',
        fileName: 'Financial_Statements_2024.pdf',
        uploadDate: '15 Nov 2024',
        size: '2.3 MB'
      },
      {
        id: '2', 
        fileName: 'Environmental_Impact_Assessment.pdf',
        uploadDate: '12 Nov 2024',
        size: '4.7 MB'
      },
      {
        id: '3',
        fileName: 'Technical_Specifications.docx',
        uploadDate: '10 Nov 2024',
        size: '1.8 MB'
      }
    ];
  }

  downloadDocument(document: any) {
    console.log('Downloading document:', document.fileName);
    alert(`Would download: ${document.fileName}`);
  }
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