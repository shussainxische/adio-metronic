import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputValidationComponent } from '../../../../../../components/ui/input-validation/input-validation.component';
import { InputCalculatedComponent } from '../../../../../../components/ui/input-calculated/input-calculated.component';
import { EvaluationDataService } from '../../../../../../services/evaluation-data.service';
import { EvaluationCalculationsService } from '../../../../../../services/evaluation-calculations.service';

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

  constructor(
    private evaluationDataService: EvaluationDataService,
    private evaluationCalculations: EvaluationCalculationsService
  ) {}

  ngOnInit() {
    this.initializeFormData();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('🔍 EMS/DMS - ngOnChanges called:', {
      readOnly: this.readOnly,
      changes: changes,
      hasReadOnlyChange: !!changes['readOnly'],
      hasEvaluationChange: !!changes['evaluation']
    });
    
    // Only reinitialize if readOnly actually changed (not just any change detection)
    if (changes['readOnly'] && changes['readOnly'].previousValue !== changes['readOnly'].currentValue) {
      this.initializeFormData();
    }
    
    // Only reload data if evaluation changed (not readOnly)
    if (changes['evaluation'] && !changes['readOnly']) {
      this.initializeFormData();
    }
  }

  private initializeFormData() {
    console.log('🔍 EMS/DMS - initializeFormData called with readOnly:', this.readOnly);
    
    // Set readonly state in the centralized service
    this.evaluationDataService.setReadOnlyState(this.readOnly);
    
    // Load configuration if provided
    if (this.evaluationConfiguration) {
      this.loadEvaluationConfiguration(this.evaluationConfiguration);
    }
    
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
    this.demandSideConsumptionControl.valueChanges.subscribe((value) => {
      debouncedSave();
      // Trigger change detection for DMS score calculation
      console.log('DMS consumption changed to:', value, 'Score:', this.dmsScore);
    });

    console.log('🔄 Form value change listeners set up for EMS/DMS component');
  }

  /**
   * Save form data to the centralized data service
   */
  private saveFormData(): void {
    const consumptionPercentage = Number(this.demandSideConsumptionControl.value) || 0;
    const dmsScore = this.evaluationCalculations.calculateAppDmsScore(consumptionPercentage);
    
    const formData = {
      connectionLoadMeter: Number(this.connectionLoadMeterControl.value) || 0,
      emsAvailability: this.emsAvailabilityControl.value || 'Available',
      demandSideConsumption: consumptionPercentage,
      dmsScore: dmsScore
    };

    this.evaluationDataService.updateFormData(formData);
    console.log('💾 EMS/DMS form data saved to centralized service, DMS Score:', dmsScore);
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
          { value: 37.5, label: 'Below 75%' },
          { value: 77, label: '75% to 79%' },
          { value: 82, label: '80% to 84%' },
          { value: 87, label: '85% to 89%' },
          { value: 92, label: '90% to 94%' },
          { value: 100, label: '95% to 105%' },
          { value: 110, label: 'Above 105%' }
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
    const consumptionPercentage = Number(this.demandSideConsumptionControl.value);
    if (!consumptionPercentage) return '0.00';
    
    const score = this.evaluationCalculations.calculateAppDmsScore(consumptionPercentage);
    return score.toFixed(2);
  }

  get dmsScoreDescription(): string {
    const consumptionPercentage = Number(this.demandSideConsumptionControl.value);
    if (!consumptionPercentage) return '';
    
    return this.evaluationCalculations.getDmsScoreDescription(consumptionPercentage);
  }

  // Method to load new configuration from API
  loadEvaluationConfiguration(config: any): void {
    this.evaluationCalculations.loadConfiguration(config);
    console.log('🔧 EMS/DMS - Evaluation configuration loaded:', config);
  }
}