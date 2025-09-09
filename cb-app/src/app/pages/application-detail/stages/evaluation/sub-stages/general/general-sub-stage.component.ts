import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../../../../../../components/ui/icon/icon.component';
import { InputComponent } from '../../../../../../components/ui/input/input.component';

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
  imports: [CommonModule, ReactiveFormsModule, IconComponent, InputComponent],
  templateUrl: './general-sub-stage.component.html',
  styleUrl: './general-sub-stage.component.scss'
})
export class GeneralSubStageComponent implements OnInit {
  @Input() readOnly: boolean = false;
  
  // Form Controls
  applicationTypeControl = new FormControl('Renewal');
  utilitiesRequiredControl = new FormControl(['Electricity', 'Gas']);
  financialYearEndDateControl = new FormControl('2025-12-31');
  
  // Application Details Data
  applicationDetailsData = {
    title: 'Application Details',
    fields: {
      applicationType: {
        label: 'Application Type',
        options: [
          { value: 'new', label: 'New Application' },
          { value: 'renewal', label: 'Renewal' },
          { value: 'modification', label: 'Modification' }
        ]
      },
      utilitiesRequired: {
        label: 'Utilities Required',
        options: [
          { value: 'electricity', label: 'Electricity' },
          { value: 'gas', label: 'Gas' },
          { value: 'water', label: 'Water' }
        ]
      },
      financialYearEndDate: {
        label: 'Financial Year End Date',
        placeholder: 'Select date'
      }
    }
  };

  ngOnInit() {
    if (this.readOnly) {
      this.applicationTypeControl.disable();
      this.utilitiesRequiredControl.disable();
      this.financialYearEndDateControl.disable();
    }
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