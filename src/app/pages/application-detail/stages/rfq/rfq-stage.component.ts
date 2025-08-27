import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FileInputComponent } from '../../../../components/ui/file-input/file-input.component';
import { InputComponent } from '../../../../components/ui/input/input.component';
import { ButtonComponent } from '../../../../components/ui/button/button.component';
import { QuotationStatusComponent, QuotationStatusData } from './quotation-status/quotation-status.component';

@Component({
  selector: 'app-rfq-stage',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FileInputComponent, InputComponent, ButtonComponent, QuotationStatusComponent],
  templateUrl: './rfq-stage.component.html',
  styleUrl: './rfq-stage.component.scss'
})
export class RfqStageComponent {
  quotationAmountControl = new FormControl('');
  proposalDocumentControl = new FormControl(null);
  acceptTerms: boolean = false;
  isSubmitted: boolean = false;
  statusData: QuotationStatusData = { type: 'under-approval' };

  onSubmitQuotation() {
    const amount = this.quotationAmountControl.value;
    if (amount && this.acceptTerms) {
      this.statusData = {
        type: 'under-approval',
        submittedAmount: amount,
        submissionDate: this.formatCurrentDate(),
        uploadedFileName: this.getUploadedFileName()
      };
      this.isSubmitted = true;
    }
  }

  resetForm() {
    this.isSubmitted = false;
    this.quotationAmountControl.reset();
    this.proposalDocumentControl.reset();
    this.acceptTerms = false;
    this.statusData = { type: 'under-approval' };
  }

  onStartEvaluation() {
    console.log('Starting evaluation...');
  }

  // Demo methods to test different status scenarios
  showAwardedStatus() {
    this.statusData = {
      type: 'awarded',
      submittedAmount: '35000',
      submissionDate: '8/21/2025',
      awardedDate: '8/26/2025',
      uploadedFileName: 'Energy_Audit_Proposal.pdf'
    };
    this.isSubmitted = true;
  }

  showNotAwardedStatus() {
    this.statusData = {
      type: 'not-awarded',
      submittedAmount: '35000',
      submissionDate: '8/24/2025',
      decisionDate: '8/27/2025',
      uploadedFileName: 'Energy_Audit_Proposal.pdf'
    };
    this.isSubmitted = true;
  }

  showMissedDeadlineStatus() {
    this.statusData = {
      type: 'missed-deadline',
      rfqDeadline: '8/25/2025'
    };
    this.isSubmitted = true;
  }

  private formatCurrentDate(): string {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear();
    return `${month}/${day}/${year}`;
  }

  private getUploadedFileName(): string {
    const file = this.proposalDocumentControl.value;
    return file ? file.name : 'Energy_Audit_Proposal.pdf';
  }

  private generateSubmissionId(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${timestamp}${random}`;
  }
}