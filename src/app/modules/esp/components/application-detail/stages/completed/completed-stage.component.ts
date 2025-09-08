import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-completed-stage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './completed-stage.component.html',
  styleUrl: './completed-stage.component.scss'
})
export class CompletedStageComponent {
  @Input() applicationData: any = null;
  @Input() licenseDetails: any = null;
  @Input() evaluationData: any = null;
  @Input() application: any = null;

  constructor(private http: HttpClient) {}

  // Dynamic getters for certificate data
  get companyName(): string {
    return this.application?.companyName || this.licenseDetails?.invCompanyName || 'DEMO Company LLC';
  }

  get industrialLicenseNo(): string {
    const licenseId = this.licenseDetails?.invLicenseId;
    return licenseId ? `in${licenseId}` : 'in2781801';
  }

  get transactionNo(): string {
    return this.application?.id || this.applicationData?.id || 'ESP-192732';
  }

  get issueDate(): string {
    // Try multiple sources for issue date
    let dateString = this.licenseDetails?.invLicenseIssueDate || this.application?.date || this.applicationData?.issueDate;
    
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  get expiryDate(): string {
    // Try multiple sources for expiry date, fallback to 30 days from now
    let dateString = this.licenseDetails?.invLicenseExpiryDate || this.application?.deadline || this.applicationData?.expiryDate;
    
    let date: Date;
    
    if (!dateString) {
      // If no expiry date available, set to 30 days from now
      date = new Date();
      date.setDate(date.getDate() + 30);
    } else {
      date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If invalid date, set to 30 days from now
        date = new Date();
        date.setDate(date.getDate() + 30);
      }
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  downloadCertificate(): void {
    console.log('Download certificate clicked');
    
    // Download the sample certificate PDF
    this.downloadPDF('assets/sample-documents/sample-certificate.pdf', 'ESP-Certificate-2025.pdf');
  }

  private downloadPDF(url: string, filename: string): void {
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        // Create a blob URL for the PDF
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        window.URL.revokeObjectURL(blobUrl);
        
        console.log(`Certificate downloaded: ${filename}`);
      },
      error: (error) => {
        console.error('Error downloading certificate:', error);
        alert('Sorry, there was an error downloading the certificate. Please try again.');
      }
    });
  }
}