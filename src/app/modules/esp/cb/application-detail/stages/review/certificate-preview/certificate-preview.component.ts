import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationStatusDto } from '@models/esp/application.model';
// import { Application } from '../../../../../services/application-status.service';

@Component({
  selector: 'app-certificate-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate-preview.component.html',
  styleUrl: './certificate-preview.component.scss'
})
export class CertificatePreviewComponent {
  @Input() application?: ApplicationStatusDto;
  @Input() certificateIssueDate: string = '';
  @Input() showModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  }

  getCertificateExpiryDate(): string {
    if (!this.certificateIssueDate) return '';
    const issueDate = new Date(this.certificateIssueDate);
    const expiryDate = new Date(issueDate.setFullYear(issueDate.getFullYear() + 1));
    return expiryDate.toISOString().split('T')[0];
  }

  onClose() {
    this.closeModal.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}