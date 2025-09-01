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
    return this.licenseDetails?.invCompanyName || 'Alpha Manufacturing Ltd';
  }

  get incentiveAmount(): string {
    // You can modify this logic based on your actual calculation
    const amount = this.evaluationData?.appInvestmentTopUpGbvAdScore || 2;
    return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  get qualifyingInvestment(): string {
    // You can modify this logic based on your actual calculation  
    const investment = this.evaluationData?.appInvestmentGbvTotalProprities || 195;
    return investment.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  get certificateNumber(): string {
    // Generate certificate number based on application data
    const year = new Date().getFullYear();
    const appId = this.applicationData?.appId || '001234';
    return `ESP-${year}-${appId.toString().padStart(6, '0')}`;
  }

  get applicationId(): string {
    return this.applicationData?.id || 'IETR-4315434';
  }

  get issueDate(): string {
    // Use current date or a specific issue date from the application
    const date = this.applicationData?.issueDate ? new Date(this.applicationData.issueDate) : new Date();
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  get validUntil(): string {
    // Certificate is valid for 3 years from issue date
    const issueDate = this.applicationData?.issueDate ? new Date(this.applicationData.issueDate) : new Date();
    const validUntilDate = new Date(issueDate);
    validUntilDate.setFullYear(validUntilDate.getFullYear() + 3);
    
    return validUntilDate.toLocaleDateString('en-US', { 
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