import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from '../../../../components/ui/file-upload/file-upload.component';
import { InputComponent } from '../../../../components/ui/input/input.component';
import { ButtonComponent } from '../../../../components/ui/button/button.component';
import { QuotationStatusComponent, QuotationStatusData } from './quotation-status/quotation-status.component';
import { Application } from '../../../../services/application-status.service';

@Component({
  selector: 'app-rfq-stage',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FileUploadComponent, InputComponent, ButtonComponent, QuotationStatusComponent],
  templateUrl: './rfq-stage.component.html',
  styleUrl: './rfq-stage.component.scss'
})
export class RfqStageComponent implements OnInit, OnChanges {
  @Input() application?: Application;
  
  quotationAmountControl = new FormControl('');
  proposalDocumentControl = new FormControl([]);
  acceptTerms: boolean = false;
  isSubmitted: boolean = false;
  statusData: QuotationStatusData = { type: 'under-approval' };

  ngOnInit() {
    this.checkApplicationStatus();
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
    // Don't allow reset for applications that are already submitted
    if (this.application?.status === 'Submitted') {
      return;
    }
    this.isSubmitted = false;
    this.quotationAmountControl.reset();
    this.proposalDocumentControl.reset();
    this.acceptTerms = false;
    this.statusData = { type: 'under-approval' };
  }

  onStartEvaluation() {
    console.log('Starting evaluation...');
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
    return (files && files.length > 0) ? files[0].name : 'Energy_Audit_Proposal.pdf';
  }
}