import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../../components/ui/input/input.component';
import { DateInputComponent } from '../../../../../../components/ui/date-input/date-input.component';
import { StatusBadgeComponent } from '../../../../../../components/ui/status-badge/status-badge.component';
import { IconComponent } from '../../../../../../components/ui/icon/icon.component';

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
export class GeneralSubStageComponent implements OnInit {
  @Input() readOnly: boolean = false;
  
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

  ngOnInit() {
    this.applicationTypeControl.setValue(this.applicationData.applicationType);
    this.financialYearEndControl.setValue(this.applicationData.financialYearEnd);
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