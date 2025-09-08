import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';

import { QuotationStatusComponent } from '../_index';

import { BaseRfqApplicationService } from '@services/_index';
import { ApplicationStatusDto, QuotationStatusData, QuotationSubmissionRequest } from '@models/esp/_index';
import { ButtonComponent, FileUploadComponent, InputNumericComponent } from '@components/ui/_index';

@Component({
  selector: 'app-rfq-stage',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FileUploadComponent, InputNumericComponent,
    ButtonComponent, QuotationStatusComponent],
  templateUrl: './rfq-stage.component.html',
  styleUrl: './rfq-stage.component.scss'
})
export class RfqStageComponent implements OnInit, OnChanges {
  @Input() application?: ApplicationStatusDto;

  quotationAmountControl = new FormControl('');
  proposalDocumentControl = new FormControl<File[]>([]);
  acceptTerms: boolean = false;
  isSubmitted: boolean = false;
  isSubmitting: boolean = false;
  statusData: QuotationStatusData = { type: 'under-approval' };

  constructor(public rfqApplicationService: BaseRfqApplicationService) { }

  ngOnInit() {
    this.checkApplicationStatus();

    // Subscribe to file control changes to trigger validation
    this.proposalDocumentControl.valueChanges.subscribe(files => {
      console.log('FormControl value changed:', files);
      console.log('FormControl value type:', typeof files, Array.isArray(files));
      console.log('Current validation state:', this.hasUploadedFile());
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['application']) {
      this.checkApplicationStatus();
    }
  }

  private checkApplicationStatus() {
    if (this.application?.status === 'Submitted') {
      this.isSubmitted = true;
      this.statusData = {
        type: 'under-approval',
        submittedAmount: 'AED 850,000',
        submissionDate: this.application.date || this.formatCurrentDate(),
        uploadedFileName: 'Energy_Audit_Proposal.pdf'
      };
    } else if (this.application?.stage === 'Evaluation' || this.application?.stage === 'Review') {
      // For evaluation and review stage applications, show awarded quotation status
      this.isSubmitted = true;
      this.statusData = {
        type: 'awarded',
        submittedAmount: 'AED 850,000',
        submissionDate: this.application.date || this.formatCurrentDate(),
        awardedDate: this.application.date || this.formatCurrentDate(),
        uploadedFileName: 'Energy_Audit_Proposal.pdf'
      };
    }
  }

  onSubmitQuotation() {
    const amount = this.quotationAmountControl.value;
    const files = this.proposalDocumentControl.value;
    debugger;
    if (!amount || !this.acceptTerms || !this.application?.appId) {
      return;
    }

    this.isSubmitting = true;

    // Prepare the submission request
    const request: QuotationSubmissionRequest = {
      file: this.convertFileToBase64(files), // Convert file to base64
      cbqAmount: parseFloat(amount),
      cbId: 1, // Default certifying body ID
      appId: this.application.appId
    };

    // Submit to API
    this.rfqApplicationService.submitQuotation(request).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          // Update UI to show submitted status
          this.statusData = {
            type: 'under-approval',
            submittedAmount: amount,
            submissionDate: this.formatCurrentDate(),
            uploadedFileName: this.getUploadedFileName()
          };
          this.isSubmitted = true;
        } else {
          console.error('Quotation submission failed:', response.errors);
          alert('Failed to submit quotation. Please try again.');
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error submitting quotation:', error);
        alert('An error occurred while submitting the quotation. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  resetForm() {
    // Don't allow reset for applications that are already submitted
    if (this.application?.status === 'Submitted') {
      return;
    }
    this.isSubmitted = false;
    this.quotationAmountControl.reset();
    this.proposalDocumentControl.reset();
    this.proposalDocumentControl.setValue([]);
    this.acceptTerms = false;
    this.statusData = { type: 'under-approval' };
  }

  onStartEvaluation() {
    console.log('Starting evaluation...');
  }

  onFilesChanged(files: File[]) {
    console.log('Files changed event:', files);
    // Explicitly set the FormControl value to ensure it's synchronized
    this.proposalDocumentControl.setValue(files);
    // Mark as touched to trigger validation
    this.proposalDocumentControl.markAsTouched();
  }

  private formatCurrentDate(): string {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear();
    return `${month}/${day}/${year}`;
  }

  private getUploadedFileName(): string {
    const files = this.proposalDocumentControl.value;
    return (files && Array.isArray(files) && files.length > 0) ? files[0].name : 'Energy_Audit_Proposal.pdf';
  }

  hasUploadedFile(): boolean {
    const files = this.proposalDocumentControl.value;
    return files && Array.isArray(files) && files.length > 0;
  }

  get isFormValid(): boolean {
    const hasAmount = !!this.quotationAmountControl.value;
    const hasTermsAccepted = this.acceptTerms;

    return hasAmount && hasTermsAccepted;
  }

  private convertFileToBase64(files: any): string {
    // For now, return a placeholder base64 string
    // In a real implementation, you would convert the actual file to base64
    if (files && files.length > 0) {
      // This would need to be implemented with proper file reading
      // For demo purposes, returning a placeholder
      return 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCg==';
    }
    // Default base64 for empty file
    return 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCg==';
  }
}
