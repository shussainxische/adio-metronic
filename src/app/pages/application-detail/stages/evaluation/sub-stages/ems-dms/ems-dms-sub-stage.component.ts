import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputValidationComponent } from '../../../../../../components/ui/input-validation/input-validation.component';
import { InputCalculatedComponent } from '../../../../../../components/ui/input-calculated/input-calculated.component';
import { Application } from '../../../../../../services/application-status.service';

@Component({
  selector: 'app-ems-dms-sub-stage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputValidationComponent, InputCalculatedComponent],
  templateUrl: './ems-dms-sub-stage.component.html',
  styleUrl: './ems-dms-sub-stage.component.scss'
})
export class EmsDmsSubStageComponent implements OnInit {
  @Input() readOnly: boolean = false;
  @Input() application?: Application;

  // ADIO View Detection
  isAdioView: boolean = false;
  
  constructor(private router: Router) {}

  ngOnInit() {
    // Detect if we're in ADIO view
    this.isAdioView = this.router.url.startsWith('/adio');

    if (this.readOnly) {
      this.connectionLoadMeterControl.disable();
      this.emsAvailabilityControl.disable();
      this.demandSideConsumptionControl.disable();
    }
  }

  get showAdioView(): boolean {
    return this.isAdioView && this.application?.stage === 'Review';
  }
  connectionLoadMeterControl = new FormControl('');
  emsAvailabilityControl = new FormControl('Available');
  demandSideConsumptionControl = new FormControl('');

  emsData = {
    title: 'EMS/DMS Assessment',
    fields: {
      connectionLoadMeter: {
        label: 'Connection Load Meter (MW)',
        placeholder: '15.5',
        helperText: 'Applicable if ≥ 10 MW',
        validationRule: (value: any) => parseFloat(value) >= 10,
        validationMessage: 'Applicable',
        invalidMessage: 'Not Applicable',
        unit: 'MW'
      },
      emsAvailability: {
        label: 'EMS Availability',
        options: [
          { value: 'Available', label: 'Available' },
          { value: 'Not Available', label: 'Not Available' }
        ],
        validationRule: (value: any) => value === 'Available',
        validationMessage: 'Applicable',
        invalidMessage: 'Not Applicable'
      },
      demandSideConsumption: {
        label: 'Demand Side Consumption (%)',
        placeholder: 'Select Consumption Range',
        options: [
          { value: 'below-75', label: 'Below 75%' },
          { value: '75-79', label: '75% to 79%' },
          { value: '80-84', label: '80% to 84%' },
          { value: '85-89', label: '85% to 89%' },
          { value: '90-94', label: '90% to 94%' },
          { value: '95-100', label: '95% to 100%' },
          { value: '101-105', label: '101% to 105%' },
          { value: 'above-105', label: 'Above 105%' }
        ]
      }
    },
    calculatedFields: {
      dmsScore: {
        label: 'DMS Score',
        tooltip: 'Calculated based on demand side consumption percentage'
      }
    }
  };

  // Meter readings properties for CB to fill
  taqaPremiseId: string = '';
  taqaAccountNumber: string = '';
  taqaConnectedLoad: string = '';
  taqaConnectivityType: string = '';
  taqaMeterNumbers: string[] = [''];
  
  adPortsPremiseId: string = '';
  adPortsAccountNumber: string = '';
  adPortsConnectedLoad: string = '';
  adPortsConnectivityType: string = '';
  adPortsMeterNumbers: string[] = [''];

  // Methods for dynamic meter management
  addTaqaMeter() {
    this.taqaMeterNumbers.push('');
  }

  removeTaqaMeter(index: number) {
    if (this.taqaMeterNumbers.length > 1) {
      this.taqaMeterNumbers.splice(index, 1);
    }
  }

  addAdPortsMeter() {
    this.adPortsMeterNumbers.push('');
  }

  removeAdPortsMeter(index: number) {
    if (this.adPortsMeterNumbers.length > 1) {
      this.adPortsMeterNumbers.splice(index, 1);
    }
  }

  get dmsScore(): string {
    const consumption = this.demandSideConsumptionControl.value;
    if (!consumption) return '0%';
    
    switch (consumption) {
      case 'above-105': return '100%';
      case '101-105': return '95%';
      case '95-100': return '90%';
      case '90-94': return '85%';
      case '85-89': return '80%';
      case '80-84': return '75%';
      case '75-79': return '70%';
      case 'below-75': return '65%';
      default: return '0%';
    }
  }
}