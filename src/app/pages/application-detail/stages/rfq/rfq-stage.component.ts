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
}