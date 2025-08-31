import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputComponent } from '../../../../../../components/ui/input/input.component';
import { DateInputComponent } from '../../../../../../components/ui/date-input/date-input.component';
import { StatusBadgeComponent } from '../../../../../../components/ui/status-badge/status-badge.component';
import { IconComponent } from '../../../../../../components/ui/icon/icon.component';
import { Application } from '../../../../../../services/application-status.service';

interface PastCertificate {
  title: string;
  certificateId: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface SimpleDocument {
  id: string;
  fileName: string;
}


@Component({
  selector: 'app-general-sub-stage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, DateInputComponent, StatusBadgeComponent, IconComponent],
  templateUrl: './general-sub-stage.component.html',
  styleUrl: './general-sub-stage.component.scss'
})
export class GeneralSubStageComponent implements OnInit, OnChanges {
  @Input() readOnly: boolean = false;
  @Input() application?: Application;
  @Input() licenseDetails: any = null;
  @Input() companyContact: any = null;
  
  applicationTypeControl = new FormControl({ value: '', disabled: true });
  financialYearEndControl = new FormControl('');

  constructor(private http: HttpClient) {}
  

  applicationDetails = {
    title: 'Application Details',
    fields: {
      applicationType: {
        label: 'Application Type',
        placeholder: 'Application Type'
      },
      utilitiesRequired: {
        label: 'Utilities Required'
      },
      financialYearEnd: {
        label: 'Financial Year End Date',
        placeholder: 'Select date'
      }
    }
  };

  pastRenewals = {
    title: 'Past Renewals',
    description: 'View and download certificates from previous renewals'
  };

  applicationData = {
    applicationType: 'Renewal',
    financialYearEnd: '2025-12-31',
    utilitiesRequired: ['Electricity', 'Gas']
  };

  get utilitiesRequired(): string[] {
    if (this.application?.category) {
      return this.application.category.split(',').map(cat => cat.trim());
    }
    return this.applicationData.utilitiesRequired;
  }

  pastCertificates: PastCertificate[] = [
    {
      title: 'Certificate 2022-2024',
      certificateId: 'CERT-2022-001',
      startDate: '2022-01-15',
      endDate: '2024-01-15',
      status: 'Expired'
    },
    {
      title: 'Certificate 2020-2022',
      certificateId: 'CERT-2020-001',
      startDate: '2020-01-15',
      endDate: '2022-01-15',
      status: 'Expired'
    },
    {
      title: 'Certificate 2018-2020',
      certificateId: 'CERT-2018-001',
      startDate: '2018-01-15',
      endDate: '2020-01-15',
      status: 'Expired'
    }
  ];

  ngOnInit() {
    this.updateFormData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['application'] || changes['licenseDetails']) {
      this.updateFormData();
    }
  }

  private updateFormData() {
    if (this.application) {
      this.applicationTypeControl.setValue(this.application.companyType || 'Renewal');
    } else {
      this.applicationTypeControl.setValue(this.applicationData.applicationType);
    }
    
    if (this.licenseDetails) {
      // Use license expiry date as financial year end
      const expiryDate = this.licenseDetails.invLicenseExpiryDate;
      if (expiryDate) {
        const formattedDate = new Date(expiryDate).toISOString().split('T')[0];
        this.financialYearEndControl.setValue(formattedDate);
      }
    } else {
      this.financialYearEndControl.setValue(this.applicationData.financialYearEnd);
    }
  }


  // Data for ViewFileSimple components
  get viewFileData(): SimpleDocument[] {
    return this.pastCertificates.map(cert => ({
      id: cert.certificateId,
      fileName: `${cert.title}.pdf`
    }));
  }

  downloadCertificate(document: SimpleDocument) {
    console.log('Downloading certificate:', document.fileName);
    
    // Map document names to actual PDF files
    let pdfUrl = '';
    let downloadName = '';
    
    if (document.fileName.includes('2022')) {
      pdfUrl = 'assets/sample-documents/historical-certificate-2022.pdf';
      downloadName = 'CERT-2022-001.pdf';
    } else if (document.fileName.includes('2020')) {
      pdfUrl = 'assets/sample-documents/historical-certificate-2020.pdf';
      downloadName = 'CERT-2020-001.pdf';
    } else if (document.fileName.includes('2018')) {
      pdfUrl = 'assets/sample-documents/historical-certificate-2018.pdf';
      downloadName = 'CERT-2018-001.pdf';
    } else {
      pdfUrl = 'assets/sample-documents/sample-certificate.pdf';
      downloadName = `${document.fileName.replace(/\s+/g, '-')}.pdf`;
    }
    
    this.downloadPDF(pdfUrl, downloadName);
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