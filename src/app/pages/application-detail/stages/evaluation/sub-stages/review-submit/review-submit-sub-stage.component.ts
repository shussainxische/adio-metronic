import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { FileUploadComponent } from '../../../../../../components/ui/file-upload/file-upload.component';
import { EvaluationStatusComponent, EvaluationStatusData } from './evaluation-status/evaluation-status.component';
import { DocumentUploadService } from '../../../../../../services/document-upload.service';
import { EvaluationSubmitService } from '../../../../../../services/evaluation-submit.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-review-submit-sub-stage',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent, EvaluationStatusComponent],
  templateUrl: './review-submit-sub-stage.component.html',
  styleUrl: './review-submit-sub-stage.component.scss'
})
export class ReviewSubmitSubStageComponent {
  @Input() readOnly: boolean = false;
  @Input() evaluationData: any = null;
  @Input() productivityData: any = null;
  uploadedFiles: File[] = [];
  confirmSubmission = false;
  isSubmitting = false;
  isSubmitted = false;
  submissionId = '';
  submissionDate = new Date();
  statusData!: EvaluationStatusData;
  appId: number = 0;

  // Getter for economic impact data from evaluationData
  get economicImpactData() {
    return this.evaluationData?.evaluation || null;
  }

  // Document upload properties
  uploadProgress: { [fileName: string]: number } = {};
  uploadedDocuments: { fileName: string; documentId?: string; uploadedAt?: string }[] = [];
  isUploading = false;
  uploadErrors: { fileName: string; error: string }[] = [];

  constructor(
    private documentUploadService: DocumentUploadService,
    private evaluationSubmitService: EvaluationSubmitService,
    private route: ActivatedRoute
  ) {
    // Get application ID from route
    this.route.params.subscribe(params => {
      this.appId = parseInt(params['id']);
    });
  }

  async submitEvaluation(): Promise<void> {
    if (!this.confirmSubmission || this.isSubmitting) {
      return;
    }

    if (!this.economicImpactData || !this.productivityData) {
      alert('Evaluation data is not available. Please complete all previous sections.');
      return;
    }

    if (!this.appId) {
      alert('Application ID is not available.');
      return;
    }

    this.isSubmitting = true;
    
    try {
      // Create evaluation request using the service helper method
      const evaluationRequest = this.evaluationSubmitService.createEvaluationRequest(
        this.appId,
        this.economicImpactData,
        this.productivityData
      );

      // Submit evaluation
      const response = await this.evaluationSubmitService.submitEvaluation(evaluationRequest).toPromise();
      
      if (response?.isSuccess) {
        // Generate submission ID from response or create one
        this.submissionId = response.data?.submissionId || 'ADIO-' + Math.random().toString(36).substr(2, 9).toUpperCase();
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
          uploadedFiles: this.uploadedDocuments.map(doc => doc.fileName)
        };
        
        // Mark as submitted
        this.isSubmitted = true;
        this.isSubmitting = false;
        
        console.log('Evaluation submitted successfully:', {
          submissionId: this.submissionId,
          uploadedDocuments: this.uploadedDocuments,
          submissionDate: this.submissionDate,
          response: response
        });
      } else {
        // Handle API errors
        const errorMessage = response?.errors?.[0]?.message || 'Submission failed';
        throw new Error(errorMessage);
      }
      
    } catch (error: any) {
      console.error('Error submitting evaluation:', error);
      
      let errorMessage = 'There was an error submitting your evaluation. Please try again.';
      if (error.error?.errors?.[0]?.message) {
        errorMessage = error.error.errors[0].message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      this.isSubmitting = false;
    }
  }

  resetForm(): void {
    this.isSubmitted = false;
    this.confirmSubmission = false;
    this.uploadedFiles = [];
    this.uploadedDocuments = [];
    this.uploadProgress = {};
    this.uploadErrors = [];
  }

  onFilesSelected(files: File[]): void {
    if (files.length > 0) {
      this.uploadFiles(files);
    }
  }

  async uploadFiles(files: File[]): Promise<void> {
    if (!this.appId) {
      console.error('Application ID not available');
      return;
    }

    this.isUploading = true;
    this.uploadErrors = [];

    for (const file of files) {
      try {
        // Validate file before upload
        const validation = this.documentUploadService.validateFile(file);
        if (!validation.isValid) {
          this.uploadErrors.push({
            fileName: file.name,
            error: validation.errorMessage || 'File validation failed'
          });
          continue;
        }

        // Initialize progress for this file
        this.uploadProgress[file.name] = 0;

        // Upload file with progress tracking
        this.documentUploadService.uploadDocument(this.appId, file, true)
          .subscribe({
            next: (event) => {
              if (event.type === HttpEventType.UploadProgress && event.total) {
                // Update progress
                const progress = Math.round(100 * event.loaded / event.total);
                this.uploadProgress[file.name] = progress;
              } else if (event.type === HttpEventType.Response) {
                // Upload completed
                const response = event.body;
                if (response?.isSuccess) {
                  this.uploadedDocuments.push({
                    fileName: file.name,
                    documentId: response.data?.documentId,
                    uploadedAt: response.data?.uploadedAt || new Date().toISOString()
                  });
                  console.log(`File ${file.name} uploaded successfully:`, response.data);
                } else {
                  this.uploadErrors.push({
                    fileName: file.name,
                    error: response?.errors?.[0]?.message || 'Upload failed'
                  });
                }
                // Remove progress tracking for completed file
                delete this.uploadProgress[file.name];
              }
            },
            error: (error) => {
              console.error(`Error uploading ${file.name}:`, error);
              this.uploadErrors.push({
                fileName: file.name,
                error: error.message || 'Upload failed'
              });
              delete this.uploadProgress[file.name];
            }
          });
      } catch (error: any) {
        this.uploadErrors.push({
          fileName: file.name,
          error: error.message || 'Upload failed'
        });
      }
    }

    // Check if all uploads are complete
    setTimeout(() => {
      if (Object.keys(this.uploadProgress).length === 0) {
        this.isUploading = false;
      }
    }, 1000);
  }

  removeUploadedDocument(index: number): void {
    this.uploadedDocuments.splice(index, 1);
  }

  getUploadProgressPercentage(fileName: string): number {
    return this.uploadProgress[fileName] || 0;
  }

  isFileUploading(fileName: string): boolean {
    return fileName in this.uploadProgress;
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  }

  getUploadProgressKeys(): string[] {
    return Object.keys(this.uploadProgress);
  }
}