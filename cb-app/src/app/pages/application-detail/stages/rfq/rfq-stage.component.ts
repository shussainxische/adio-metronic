import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploadComponent } from '../../../../components/ui/file-upload/file-upload.component';
import { InputComponent } from '../../../../components/ui/input/input.component';
import { ButtonComponent } from '../../../../components/ui/button/button.component';
import { QuotationStatusComponent, QuotationStatusData } from './quotation-status/quotation-status.component';
import { RejectedQuotationsComponent, RejectedQuotation } from './rejected-quotations/rejected-quotations.component';
import { Application } from '../../../../services/application-status.service';

interface CertifyingBodyQuotation {
  id: string;
  name: string;
  projects: number;
  responseRate: number;
  status: 'submitted' | 'pending';
  quoteAmount?: string;
  responseTime?: string;
  slaStatus?: 'on-time' | 'overdue';
  overdueDays?: number;
  documentCount?: number;
  submissionDate?: string;
  awarded?: boolean;
}

@Component({
  selector: 'app-rfq-stage',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FileUploadComponent, InputComponent, ButtonComponent, QuotationStatusComponent, RejectedQuotationsComponent],
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
  isAdioView: boolean = false;
  rejectedQuotations: RejectedQuotation[] = [];
  certifyingBodies: CertifyingBodyQuotation[] = [
    {
      id: 'tuv-sud',
      name: 'Al Tamimi Certification',
      projects: 12,
      responseRate: 95,
      status: 'pending',
      slaStatus: 'on-time'
    },
    {
      id: 'bureau-veritas',
      name: 'Emirates Verification Co.',
      projects: 8,
      responseRate: 88,
      status: 'pending',
      slaStatus: 'on-time'
    },
    {
      id: 'dnv-gl',
      name: 'Gulf Standards Institute',
      projects: 3,
      responseRate: 45,
      status: 'pending',
      slaStatus: 'on-time'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Detect if we're in ADIO view based on URL
    this.isAdioView = this.router.url.startsWith('/adio');
    this.setCertifyingBodiesData();
    this.checkApplicationStatus();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['application']) {
      this.setCertifyingBodiesData();
      this.checkApplicationStatus();
    }
  }

  private setCertifyingBodiesData() {
    // For Evaluation In Progress/Returned applications and Review stage applications, show 2 submitted + 1 pending with one awarded
    if ((this.application?.stage === 'Evaluation' && (this.application?.status === 'In Progress' || this.application?.status === 'Returned')) || this.application?.stage === 'Review') {
      this.certifyingBodies = [
        {
          id: 'tuv-sud',
          name: 'Al Tamimi Certification',
          projects: 12,
          responseRate: 95,
          status: 'submitted',
          quoteAmount: 'AED 45,000',
          submissionDate: '15 Dec 2024',
          awarded: true
        },
        {
          id: 'bureau-veritas',
          name: 'Emirates Verification Co.',
          projects: 8,
          responseRate: 88,
          status: 'submitted',
          quoteAmount: 'AED 52,500',
          submissionDate: '14 Dec 2024'
        },
        {
          id: 'dnv-gl',
          name: 'Gulf Standards Institute',
          projects: 3,
          responseRate: 45,
          status: 'pending',
          slaStatus: 'on-time'
        }
      ];
    } else if (this.application?.id === 'ESP001') {
      // ESP001 should have all red icons (overdue)
      this.certifyingBodies = [
        {
          id: 'tuv-sud',
          name: 'Al Tamimi Certification',
          projects: 12,
          responseRate: 95,
          status: 'pending',
          slaStatus: 'overdue'
        },
        {
          id: 'bureau-veritas',
          name: 'Emirates Verification Co.',
          projects: 8,
          responseRate: 88,
          status: 'pending',
          slaStatus: 'overdue'
        },
        {
          id: 'dnv-gl',
          name: 'Gulf Standards Institute',
          projects: 3,
          responseRate: 45,
          status: 'pending',
          slaStatus: 'overdue'
        }
      ];
    } else if (this.application?.id === 'ESP003') {
      // ESP003 quotation-submitted: 2 submitted + 1 pending (orange)
      this.certifyingBodies = [
        {
          id: 'tuv-sud',
          name: 'Al Tamimi Certification',
          projects: 12,
          responseRate: 95,
          status: 'submitted',
          quoteAmount: 'AED 45,000',
          submissionDate: '15 Dec 2024'
        },
        {
          id: 'bureau-veritas',
          name: 'Emirates Verification Co.',
          projects: 8,
          responseRate: 88,
          status: 'submitted',
          quoteAmount: 'AED 52,500',
          submissionDate: '14 Dec 2024'
        },
        {
          id: 'dnv-gl',
          name: 'Gulf Standards Institute',
          projects: 3,
          responseRate: 45,
          status: 'pending',
          slaStatus: 'on-time'
        }
      ];
    } else {
      // ESP002 and others should have all yellow icons (on-time)
      this.certifyingBodies = [
        {
          id: 'tuv-sud',
          name: 'Al Tamimi Certification',
          projects: 12,
          responseRate: 95,
          status: 'pending',
          slaStatus: 'on-time'
        },
        {
          id: 'bureau-veritas',
          name: 'Emirates Verification Co.',
          projects: 8,
          responseRate: 88,
          status: 'pending',
          slaStatus: 'on-time'
        },
        {
          id: 'dnv-gl',
          name: 'Gulf Standards Institute',
          projects: 3,
          responseRate: 45,
          status: 'pending',
          slaStatus: 'on-time'
        }
      ];
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
        awardedToCB: 'Al Tamimi Certification',
        uploadedFileName: 'Energy_Audit_Proposal.pdf'
      };
      // Set rejected quotations for ADIO view
      if (this.isAdioView) {
        this.rejectedQuotations = [
          {
            cbName: 'Emirates Verification Co.',
            amount: 'AED 52,500',
            submissionDate: '14 Dec 2024',
            status: 'submitted'
          },
          {
            cbName: 'Gulf Standards Institute',
            status: 'pending'
          }
        ];
      }
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

  sendReminder(cbId: string): void {
    const cb = this.certifyingBodies.find(body => body.id === cbId);
    if (cb) {
      // Show some feedback or notification
      console.log(`Sending reminder to ${cb.name}`);
      // In a real app, this would make an API call
    }
  }

  viewProposal(cbId: string): void {
    const cb = this.certifyingBodies.find(body => body.id === cbId);
    if (cb) {
      console.log(`Viewing proposal for ${cb.name}`);
      // In a real app, this would open/download the proposal document
    }
  }
}