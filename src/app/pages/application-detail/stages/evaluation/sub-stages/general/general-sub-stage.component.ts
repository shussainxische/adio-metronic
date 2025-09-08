import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '../../../../../../components/ui/input/input.component';
import { DateInputComponent } from '../../../../../../components/ui/date-input/date-input.component';
import { StatusBadgeComponent } from '../../../../../../components/ui/status-badge/status-badge.component';
import { IconComponent } from '../../../../../../components/ui/icon/icon.component';
import { DataTableSimpleComponent, SimpleTableRow } from '../../../../../../components/ui/data-table-simple/data-table-simple.component';
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
  imports: [CommonModule, ReactiveFormsModule, InputComponent, DateInputComponent, StatusBadgeComponent, IconComponent, DataTableSimpleComponent],
  templateUrl: './general-sub-stage.component.html',
  styleUrl: './general-sub-stage.component.scss'
})
export class GeneralSubStageComponent implements OnInit {
  @Input() readOnly: boolean = false;
  @Input() application?: Application;
  
  applicationTypeControl = new FormControl({ value: '', disabled: true });
  financialYearEndControl = new FormControl('');
  

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

  // ADIO View Detection
  isAdioView: boolean = false;
  
  // ADIO Static Data for Review Applications
  allApplicationData: SimpleTableRow[] = [
    { fieldLabel: 'Application Type', labelEn: 'New Manufacturing Entity', labelAr: 'New Manufacturing Entity' },
    { fieldLabel: 'Financial Year End', labelEn: 'Dec 31, 2024', labelAr: 'Dec 31, 2024' },
    { fieldLabel: 'Utilities Required', labelEn: 'Electricity, Gas', labelAr: 'Electricity, Gas' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Detect if we're in ADIO view
    this.isAdioView = this.router.url.startsWith('/adio');
    
    this.applicationTypeControl.setValue(this.applicationData.applicationType);
    this.financialYearEndControl.setValue(this.applicationData.financialYearEnd);
  }

  get showAdioView(): boolean {
    return this.isAdioView && this.application?.stage === 'Review';
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
    alert(`Would download: ${document.fileName}`);
  }
}