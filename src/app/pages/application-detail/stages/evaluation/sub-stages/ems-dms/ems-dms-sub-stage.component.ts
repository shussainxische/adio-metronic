import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputValidationComponent } from '../../../../../../components/ui/input-validation/input-validation.component';
import { InputCalculatedComponent } from '../../../../../../components/ui/input-calculated/input-calculated.component';
import { EvaluationDataService } from '../../../../../../services/evaluation-data.service';

@Component({
  selector: 'app-ems-dms-sub-stage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputValidationComponent, InputCalculatedComponent],
  templateUrl: './ems-dms-sub-stage.component.html',
  styleUrl: './ems-dms-sub-stage.component.scss'
})
export class EmsDmsSubStageComponent implements OnInit, OnChanges {
  @Input() readOnly: boolean = false;
  @Input() evaluation: any = null;
  @Input() evaluationConfiguration: any = null;

  constructor(private evaluationDataService: EvaluationDataService) {}

  ngOnInit() {
    this.initializeFormData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['evaluation'] || changes['readOnly']) {
      this.initializeFormData();
    }
  }

  private initializeFormData() {
    console.log('🔍 EMS/DMS - initializeFormData called with readOnly:', this.readOnly);
    
    // Set readonly state in the centralized service
    this.evaluationDataService.setReadOnlyState(this.readOnly);
    
    // Load data from evaluation API if available, otherwise load saved form data
    if (this.evaluation) {
      this.loadFromApiData();
    } else {
      this.loadFormData();
    }
    
    this.updateFormControlStates();
  }

  private loadFromApiData(): void {
    if (!this.evaluation) return;
    
    this.connectionLoadMeterControl.setValue((this.evaluation.appConnectionLoadMeter || 0).toString());
    this.emsAvailabilityControl.setValue(this.evaluation.appEmsApplicability === 1 ? 'Available' : 'Not Available');
    this.demandSideConsumptionControl.setValue((this.evaluation.demandSideConsumptionPercentage || 0).toString());

    console.log('📥 EMS/DMS form data loaded from API evaluation data');
  }

  /**
   * Load form data from the centralized data service
   */
  private loadFormData(): void {
    const savedData = this.evaluationDataService.getEmsDmsData();
    
    this.connectionLoadMeterControl.setValue(savedData.connectionLoadMeter?.toString() || '0');
    this.emsAvailabilityControl.setValue(savedData.emsAvailability || 'Available');
    this.demandSideConsumptionControl.setValue(savedData.demandSideConsumption?.toString() || '0');

    console.log('📥 EMS/DMS form data loaded from centralized data service');
  }

  private updateFormControlStates(): void {
    if (this.readOnly) {
      this.connectionLoadMeterControl.disable({ emitEvent: false });
      this.emsAvailabilityControl.disable({ emitEvent: false });
      this.demandSideConsumptionControl.disable({ emitEvent: false });
      console.log('🔒 EMS/DMS - All FormControls disabled for readonly mode');
    } else {
      this.connectionLoadMeterControl.enable({ emitEvent: false });
      this.emsAvailabilityControl.enable({ emitEvent: false });
      this.demandSideConsumptionControl.enable({ emitEvent: false });
      this.setupFormValueListeners();
      console.log('🔓 EMS/DMS - All FormControls enabled and listeners set up');
    }
    
    console.log('📥 EMS/DMS component form controls updated with readonly:', this.readOnly);
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

    this.connectionLoadMeterControl.valueChanges.subscribe(() => debouncedSave());
    this.emsAvailabilityControl.valueChanges.subscribe(() => debouncedSave());
    this.demandSideConsumptionControl.valueChanges.subscribe(() => debouncedSave());

    console.log('🔄 Form value change listeners set up for EMS/DMS component');
  }

  /**
   * Save form data to the centralized data service
   */
  private saveFormData(): void {
    const formData = {
      connectionLoadMeter: Number(this.connectionLoadMeterControl.value) || 0,
      emsAvailability: this.emsAvailabilityControl.value || 'Available',
      demandSideConsumption: Number(this.demandSideConsumptionControl.value) || 0
    };

    this.evaluationDataService.updateFormData(formData);
    console.log('💾 EMS/DMS form data saved to centralized service');
  }

  /**
   * Public method to manually save form data
   */
  public saveFormDataManually(): void {
    this.saveFormData();
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