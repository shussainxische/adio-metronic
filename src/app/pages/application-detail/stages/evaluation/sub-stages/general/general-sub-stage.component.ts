import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputComponent } from '../../../../../../components/ui/input/input.component';
import { DateInputComponent } from '../../../../../../components/ui/date-input/date-input.component';
import { StatusBadgeComponent } from '../../../../../../components/ui/status-badge/status-badge.component';
import { IconComponent } from '../../../../../../components/ui/icon/icon.component';
import { Application } from '../../../../../../services/application-status.service';
import { EvaluationDataService } from '../../../../../../services/evaluation-data.service';

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
  @Input() applicationSummary: any = null;
  
  applicationTypeControl = new FormControl({ value: '', disabled: true });
  financialYearEndControl = new FormControl('');

  constructor(
    private http: HttpClient,
    private evaluationDataService: EvaluationDataService
  ) {}
  

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
    if (this.applicationSummary) {
      const utilities = [];
      if (this.applicationSummary.appIsElectricity) utilities.push('Electricity');
      if (this.applicationSummary.appIsGas) utilities.push('Gas');
      return utilities;
    }
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
    if (changes['application'] || changes['licenseDetails'] || changes['applicationSummary']) {
      this.updateFormData();
    }
  }

  private updateFormData() {
    console.log('🔍 General - updateFormData called with readOnly:', this.readOnly);
    
    // Set readonly state in the centralized service
    this.evaluationDataService.setReadOnlyState(this.readOnly);
    
    // Load data from applicationSummary if available, otherwise load saved form data
    if (this.applicationSummary) {
      this.loadFromApplicationSummary();
    } else {
      this.loadFormData();
    }
    
    // Handle readonly state
    this.updateFormControlStates();
  }
  
  private loadFromApplicationSummary(): void {
    // Set application type from applicationSummary or application data
    if (this.applicationSummary?.appTypeName) {
      this.applicationTypeControl.setValue(this.applicationSummary.appTypeName);
    } else if (this.application) {
      this.applicationTypeControl.setValue(this.application.companyType || 'Renewal');
    } else {
      this.applicationTypeControl.setValue(this.applicationData.applicationType);
    }
    
    // Set financial year end from applicationSummary or license details
    if (this.applicationSummary?.appFinancialYearEndData) {
      const formattedDate = new Date(this.applicationSummary.appFinancialYearEndData).toISOString().split('T')[0];
      this.financialYearEndControl.setValue(formattedDate);
    } else if (this.licenseDetails) {
      const expiryDate = this.licenseDetails.invLicenseExpiryDate;
      if (expiryDate) {
        const formattedDate = new Date(expiryDate).toISOString().split('T')[0];
        this.financialYearEndControl.setValue(formattedDate);
      }
    } else {
      this.financialYearEndControl.setValue(this.applicationData.financialYearEnd);
    }

    console.log('📥 General component form data updated from application summary');
  }

  /**
   * Load form data from the centralized data service
   */
  private loadFormData(): void {
    const savedData = this.evaluationDataService.getGeneralData();
    
    this.applicationTypeControl.setValue(savedData.applicationType || 'Renewal');
    this.financialYearEndControl.setValue(savedData.financialYearEnd || new Date().toISOString().split('T')[0]);

    console.log('📥 General form data loaded from centralized data service');
  }

  /**
   * Update form control states based on readonly mode
   */
  private updateFormControlStates(): void {
    if (this.readOnly) {
      this.applicationTypeControl.disable({ emitEvent: false });
      this.financialYearEndControl.disable({ emitEvent: false });
      console.log('🔒 General - All FormControls disabled for readonly mode');
    } else {
      // Application type is always disabled as it comes from API
      // this.applicationTypeControl.enable({ emitEvent: false }); 
      this.financialYearEndControl.enable({ emitEvent: false });
      this.setupFormValueListeners();
      console.log('🔓 General - FormControls enabled and listeners set up');
    }
  }

  /**
   * Set up form value change listeners to automatically save data
   */
  private setupFormValueListeners(): void {
    // Create a debounced save function to avoid too many saves
    let saveTimeout: any;
    const debouncedSave = () => {
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => this.saveFormData(), 1000); // Save after 1 second of inactivity
    };

    // Only listen to financialYearEnd changes (applicationType is readonly from API)
    this.financialYearEndControl.valueChanges.subscribe(() => debouncedSave());

    console.log('🔄 Form value change listeners set up for General component');
  }

  /**
   * Save form data to the centralized data service
   */
  private saveFormData(): void {
    const formData = {
      applicationType: this.applicationTypeControl.value || 'Renewal',
      financialYearEnd: this.financialYearEndControl.value || new Date().toISOString().split('T')[0],
      utilitiesRequired: this.utilitiesRequired || ['Electricity', 'Gas']
    };

    this.evaluationDataService.updateFormData(formData);
    console.log('💾 General form data saved to centralized service');
  }

  /**
   * Public method to manually save form data
   */
  public saveFormDataManually(): void {
    this.saveFormData();
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
    
    // Use sample certificate for all downloads
    const pdfUrl = 'assets/sample-documents/sample-certificate.pdf';
    const downloadName = `${document.fileName.replace(/\s+/g, '-')}.pdf`;
    
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