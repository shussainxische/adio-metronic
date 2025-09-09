import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputValidationComponent } from '../../../../../../components/ui/input-validation/input-validation.component';
import { InputCalculatedComponent } from '../../../../../../components/ui/input-calculated/input-calculated.component';
import { InputComponent } from '../../../../../../components/ui/input/input.component';

@Component({
  selector: 'app-ems-dms-sub-stage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputValidationComponent, InputCalculatedComponent, InputComponent],
  templateUrl: './ems-dms-sub-stage.component.html',
  styleUrl: './ems-dms-sub-stage.component.scss'
})
export class EmsDmsSubStageComponent {
  @Input() readOnly: boolean = false;
  connectionLoadMeterControl = new FormControl('');
  emsAvailabilityControl = new FormControl('Available');
  demandSideConsumptionControl = new FormControl('');

  // AD Ports FormControls
  adPortsPremiseIdControl = new FormControl('');
  adPortsAccountNumberControl = new FormControl('');
  adPortsConnectivityTypeControl = new FormControl('');
  adPortsConnectedLoadControl = new FormControl('');
  adPortsMeters: string[] = [''];
  adPortsMeterControls: FormControl[] = [new FormControl('')];

  // TAQA FormControls
  taqaGasProviderInfoControl = new FormControl('');
  taqaGasMeters: string[] = [''];
  taqaGasMeterControls: FormControl[] = [new FormControl('')];

  connectivityTypeOptions = [
    { value: 'low-voltage-400v', label: 'Low Voltage (400V)' },
    { value: 'medium-voltage-11kv', label: 'Medium Voltage (11kV)' },
    { value: 'high-voltage-33kv', label: 'High Voltage (33kV)' },
    { value: 'high-voltage-132kv', label: 'High Voltage (132kV)' },
    { value: 'extra-high-voltage-220kv', label: 'Extra High Voltage (220kV+)' }
  ];

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

  addAdPortsMeter(): void {
    this.adPortsMeters.push('');
    this.adPortsMeterControls.push(new FormControl(''));
  }

  removeAdPortsMeter(index: number): void {
    if (this.adPortsMeters.length > 1) {
      this.adPortsMeters.splice(index, 1);
      this.adPortsMeterControls.splice(index, 1);
    }
  }

  addTaqaMeter(): void {
    this.taqaGasMeters.push('');
    this.taqaGasMeterControls.push(new FormControl(''));
  }

  removeTaqaMeter(index: number): void {
    if (this.taqaGasMeters.length > 1) {
      this.taqaGasMeters.splice(index, 1);
      this.taqaGasMeterControls.splice(index, 1);
    }
  }
}