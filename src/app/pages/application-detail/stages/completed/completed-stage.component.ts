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

  constructor(private http: HttpClient) {}

  // Dynamic getters for certificate data
  get companyName(): string {
    return this.licenseDetails?.invCompanyName || 'DEMO Company LLC';
  }

  get industrialLicenseNo(): string {
    return this.licenseDetails?.invLicenseId || 'in2781801';
  }

  get transactionNo(): string {
    return this.applicationData?.id || 'ESP-192732';
  }

  get issueDate(): string {
    // Return dash if no issue date available
    if (!this.applicationData?.issueDate) return '-';
    
    const date = new Date(this.applicationData.issueDate);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  get expiryDate(): string {
    // Return dash if no expiry date available
    if (!this.applicationData?.expiryDate) return '-';
    
    const date = new Date(this.applicationData.expiryDate);
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