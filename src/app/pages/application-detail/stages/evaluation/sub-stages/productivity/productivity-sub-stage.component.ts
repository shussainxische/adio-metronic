import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../../components/ui/input/input.component';
import { InputCalculatedComponent } from '../../../../../../components/ui/input-calculated/input-calculated.component';
import { EvaluationCalculationsService } from '../../../../../../services/evaluation-calculations.service';
import { EvaluationDataService } from '../../../../../../services/evaluation-data.service';

@Component({
  selector: 'app-productivity-sub-stage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, InputCalculatedComponent],
  templateUrl: './productivity-sub-stage.component.html',
  styleUrl: './productivity-sub-stage.component.scss'
})
export class ProductivitySubStageComponent implements OnInit, OnChanges {
  @Input() readOnly: boolean = false;
  @Input() evaluation: any = null;
  @Input() evaluationConfiguration: any = null;

  constructor(
    private evaluationCalculations: EvaluationCalculationsService,
    private evaluationDataService: EvaluationDataService
  ) {}

  ngOnInit() {
    this.initializeFormControls();
    this.initializeFormData();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('🔍 Productivity - ngOnChanges called:', {
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

  /**
   * Initialize FormControls (placeholder for future enhancement)
   */
  private initializeFormControls(): void {
    // FormControls are already initialized as class properties
    // This method is a placeholder for future enhancement to initialize with proper disabled state
    console.log('🔧 Productivity - FormControls initialization (placeholder)');
  }

  private initializeFormData() {
    console.log('🔍 Productivity - initializeFormData called with readOnly:', this.readOnly);
    
    // Set readonly state in the centralized service
    this.evaluationDataService.setReadOnlyState(this.readOnly);
    
    // Load data from evaluation API if available, otherwise load saved form data
    if (this.evaluation) {
      this.loadFromApiData();
    } else {
      this.loadFormData();
    }

    // Handle readonly state by disabling FormControls
    if (this.readOnly) {
      this.disableAllFormControls();
      console.log('🔒 Productivity - All FormControls disabled for readonly mode');
    } else {
      this.enableAllFormControls();
      this.setupFormValueListeners();
      console.log('🔓 Productivity - All FormControls enabled and listeners set up');
    }
    
    console.log('📥 Productivity component initialized with readonly:', this.readOnly);
  }

  private loadFromApiData(): void {
    if (!this.evaluation) return;
    
    this.totalRevenueMainActivityControl.setValue((this.evaluation.appProductRevenueMain || 0).toString());
    this.finishedGoodsBeginningControl.setValue((this.evaluation.appProductFinishedgoodsBoy || 0).toString());
    this.finishedGoodsEndControl.setValue((this.evaluation.aappProductFinishedgoodsEoy || 0).toString());
    this.workInProgressBeginningControl.setValue((this.evaluation.appProductWipBoy || 0).toString());
    this.workInProgressEndControl.setValue((this.evaluation.appProductWipEoy || 0).toString());
    this.otherMiscellaneousIncomeControl.setValue((this.evaluation.appProductRevenueMisc || 0).toString());
    this.rentalsOfBuildingControl.setValue((this.evaluation.appProductRevenueRentals || 0).toString());
    this.averageEmployeesControl.setValue((this.evaluation.appProductAvgNumberEmployees || 108).toString());
    
    this.totalCostOfProductionControl.setValue((this.evaluation.appTotalCostofProduction || 0).toString());
    this.wagesSalariesBonusesCogsControl.setValue((this.evaluation.appProductWagesSalariesBonusesCashCogs || 0).toString());
    this.benefitsGrantedEmployeesCogsControl.setValue((this.evaluation.appProductBenefitsGrantedEmpCogs || 0).toString());
    this.depreciationCogsControl.setValue((this.evaluation.appDepreciationCogs || 0).toString());
    this.totalGeneralAdminExpensesControl.setValue((this.evaluation.appProductTotalGeneralAdminExpenses || 0).toString());
    this.wagesSalariesBonusesAdminControl.setValue((this.evaluation.appProductWagesSalariesBonusesCashGa || 0).toString());
    this.benefitsGrantedEmployeesAdminControl.setValue((this.evaluation.appProductBenefitsGrantedEmpGa || 0).toString());
    this.depreciationAdminControl.setValue((this.evaluation.appDepreciationGA || 0).toString());
    this.bankingChargesControl.setValue((this.evaluation.appProductBankingCharges || 0).toString());

    console.log('📥 Productivity form data loaded from API evaluation data');
  }

  /**
   * Load form data from the centralized data service
   */
  private loadFormData(): void {
    const savedData = this.evaluationDataService.getProductivityData();
    
    this.totalRevenueMainActivityControl.setValue(savedData.totalRevenueMainActivity?.toString() || '0');
    this.finishedGoodsBeginningControl.setValue(savedData.finishedGoodsBeginning?.toString() || '0');
    this.finishedGoodsEndControl.setValue(savedData.finishedGoodsEnd?.toString() || '0');
    this.workInProgressBeginningControl.setValue(savedData.workInProgressBeginning?.toString() || '0');
    this.workInProgressEndControl.setValue(savedData.workInProgressEnd?.toString() || '0');
    this.otherMiscellaneousIncomeControl.setValue(savedData.otherMiscellaneousIncome?.toString() || '0');
    this.rentalsOfBuildingControl.setValue(savedData.rentalsOfBuilding?.toString() || '0');
    this.averageEmployeesControl.setValue(savedData.averageEmployees?.toString() || '108');
    
    this.totalCostOfProductionControl.setValue(savedData.totalCostOfProduction?.toString() || '0');
    this.wagesSalariesBonusesCogsControl.setValue(savedData.wagesSalariesBonusesCogs?.toString() || '0');
    this.benefitsGrantedEmployeesCogsControl.setValue(savedData.benefitsGrantedEmployeesCogs?.toString() || '0');
    this.depreciationCogsControl.setValue(savedData.depreciationCogs?.toString() || '0');
    this.totalGeneralAdminExpensesControl.setValue(savedData.totalGeneralAdminExpenses?.toString() || '0');
    this.wagesSalariesBonusesAdminControl.setValue(savedData.wagesSalariesBonusesAdmin?.toString() || '0');
    this.benefitsGrantedEmployeesAdminControl.setValue(savedData.benefitsGrantedEmployeesAdmin?.toString() || '0');
    this.depreciationAdminControl.setValue(savedData.depreciationAdmin?.toString() || '0');
    this.bankingChargesControl.setValue(savedData.bankingCharges?.toString() || '0');

    console.log('📥 Productivity form data loaded from centralized data service');
  }

  /**
   * Disable all form controls for readonly mode
   */
  private disableAllFormControls(): void {
    this.totalRevenueMainActivityControl.disable({ emitEvent: false });
    this.finishedGoodsBeginningControl.disable({ emitEvent: false });
    this.finishedGoodsEndControl.disable({ emitEvent: false });
    this.workInProgressBeginningControl.disable({ emitEvent: false });
    this.workInProgressEndControl.disable({ emitEvent: false });
    this.otherMiscellaneousIncomeControl.disable({ emitEvent: false });
    this.rentalsOfBuildingControl.disable({ emitEvent: false });
    this.averageEmployeesControl.disable({ emitEvent: false });
    
    this.totalCostOfProductionControl.disable({ emitEvent: false });
    this.wagesSalariesBonusesCogsControl.disable({ emitEvent: false });
    this.benefitsGrantedEmployeesCogsControl.disable({ emitEvent: false });
    this.depreciationCogsControl.disable({ emitEvent: false });
    this.totalGeneralAdminExpensesControl.disable({ emitEvent: false });
    this.wagesSalariesBonusesAdminControl.disable({ emitEvent: false });
    this.benefitsGrantedEmployeesAdminControl.disable({ emitEvent: false });
    this.depreciationAdminControl.disable({ emitEvent: false });
    this.bankingChargesControl.disable({ emitEvent: false });
  }

  /**
   * Enable all form controls for edit mode
   */
  private enableAllFormControls(): void {
    this.totalRevenueMainActivityControl.enable({ emitEvent: false });
    this.finishedGoodsBeginningControl.enable({ emitEvent: false });
    this.finishedGoodsEndControl.enable({ emitEvent: false });
    this.workInProgressBeginningControl.enable({ emitEvent: false });
    this.workInProgressEndControl.enable({ emitEvent: false });
    this.otherMiscellaneousIncomeControl.enable({ emitEvent: false });
    this.rentalsOfBuildingControl.enable({ emitEvent: false });
    this.averageEmployeesControl.enable({ emitEvent: false });
    
    this.totalCostOfProductionControl.enable({ emitEvent: false });
    this.wagesSalariesBonusesCogsControl.enable({ emitEvent: false });
    this.benefitsGrantedEmployeesCogsControl.enable({ emitEvent: false });
    this.depreciationCogsControl.enable({ emitEvent: false });
    this.totalGeneralAdminExpensesControl.enable({ emitEvent: false });
    this.wagesSalariesBonusesAdminControl.enable({ emitEvent: false });
    this.benefitsGrantedEmployeesAdminControl.enable({ emitEvent: false });
    this.depreciationAdminControl.enable({ emitEvent: false });
    this.bankingChargesControl.enable({ emitEvent: false });
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

    this.totalRevenueMainActivityControl.valueChanges.subscribe(() => debouncedSave());
    this.finishedGoodsBeginningControl.valueChanges.subscribe(() => debouncedSave());
    this.finishedGoodsEndControl.valueChanges.subscribe(() => debouncedSave());
    this.workInProgressBeginningControl.valueChanges.subscribe(() => debouncedSave());
    this.workInProgressEndControl.valueChanges.subscribe(() => debouncedSave());
    this.otherMiscellaneousIncomeControl.valueChanges.subscribe(() => debouncedSave());
    this.rentalsOfBuildingControl.valueChanges.subscribe(() => debouncedSave());
    this.averageEmployeesControl.valueChanges.subscribe(() => debouncedSave());
    
    this.totalCostOfProductionControl.valueChanges.subscribe(() => debouncedSave());
    this.wagesSalariesBonusesCogsControl.valueChanges.subscribe(() => debouncedSave());
    this.benefitsGrantedEmployeesCogsControl.valueChanges.subscribe(() => debouncedSave());
    this.depreciationCogsControl.valueChanges.subscribe(() => debouncedSave());
    this.totalGeneralAdminExpensesControl.valueChanges.subscribe(() => debouncedSave());
    this.wagesSalariesBonusesAdminControl.valueChanges.subscribe(() => debouncedSave());
    this.benefitsGrantedEmployeesAdminControl.valueChanges.subscribe(() => debouncedSave());
    this.depreciationAdminControl.valueChanges.subscribe(() => debouncedSave());
    this.bankingChargesControl.valueChanges.subscribe(() => debouncedSave());

    console.log('🔄 Form value change listeners set up for Productivity component');
  }

  /**
   * Save form data to the centralized data service
   */
  private saveFormData(): void {
    const formData = {
      totalRevenueMainActivity: Number(this.totalRevenueMainActivityControl.value) || 0,
      finishedGoodsBeginning: Number(this.finishedGoodsBeginningControl.value) || 0,
      finishedGoodsEnd: Number(this.finishedGoodsEndControl.value) || 0,
      workInProgressBeginning: Number(this.workInProgressBeginningControl.value) || 0,
      workInProgressEnd: Number(this.workInProgressEndControl.value) || 0,
      otherMiscellaneousIncome: Number(this.otherMiscellaneousIncomeControl.value) || 0,
      rentalsOfBuilding: Number(this.rentalsOfBuildingControl.value) || 0,
      averageEmployees: Number(this.averageEmployeesControl.value) || 108,
      totalCostOfProduction: Number(this.totalCostOfProductionControl.value) || 0,
      wagesSalariesBonusesCogs: Number(this.wagesSalariesBonusesCogsControl.value) || 0,
      benefitsGrantedEmployeesCogs: Number(this.benefitsGrantedEmployeesCogsControl.value) || 0,
      depreciationCogs: Number(this.depreciationCogsControl.value) || 0,
      totalGeneralAdminExpenses: Number(this.totalGeneralAdminExpensesControl.value) || 0,
      wagesSalariesBonusesAdmin: Number(this.wagesSalariesBonusesAdminControl.value) || 0,
      benefitsGrantedEmployeesAdmin: Number(this.benefitsGrantedEmployeesAdminControl.value) || 0,
      depreciationAdmin: Number(this.depreciationAdminControl.value) || 0,
      bankingCharges: Number(this.bankingChargesControl.value) || 0
    };

    this.evaluationDataService.updateFormData(formData);
    console.log('💾 Productivity form data saved to centralized service');
  }

  /**
   * Public method to manually save form data
   */
  public saveFormDataManually(): void {
    this.saveFormData();
  }


  totalRevenueMainActivityControl = new FormControl('0');
  finishedGoodsBeginningControl = new FormControl('0');
  finishedGoodsEndControl = new FormControl('0');
  workInProgressBeginningControl = new FormControl('0');
  workInProgressEndControl = new FormControl('0');
  otherMiscellaneousIncomeControl = new FormControl('0');
  rentalsOfBuildingControl = new FormControl('0');
  averageEmployeesControl = new FormControl('108');

  totalCostOfProductionControl = new FormControl('0');
  wagesSalariesBonusesCogsControl = new FormControl('0');
  benefitsGrantedEmployeesCogsControl = new FormControl('0');
  depreciationCogsControl = new FormControl('0');
  totalGeneralAdminExpensesControl = new FormControl('0');
  wagesSalariesBonusesAdminControl = new FormControl('0');
  benefitsGrantedEmployeesAdminControl = new FormControl('0');
  depreciationAdminControl = new FormControl('0');
  bankingChargesControl = new FormControl('0');


  revenueData = {
    title: 'Revenue',
    fields: {
      totalRevenueMainActivity: {
        label: 'Total Revenue from Main Activity',
        placeholder: '5,000,000',
        validationType: 'number' as const,
      },
      finishedGoodsBeginning: {
        label: 'Finished Goods (Beginning of Year)',
        placeholder: '300,000',
        validationType: 'number' as const,
      },
      finishedGoodsEnd: {
        label: 'Finished Goods (End of Year)',
        placeholder: '400,000',
        validationType: 'number' as const,
      },
      workInProgressBeginning: {
        label: 'Work in Process (Beginning of Year)',
        placeholder: '200,000',
        validationType: 'number' as const,
      },
      workInProgressEnd: {
        label: 'Work in Process (End of Year)',
        placeholder: '250,000',
        validationType: 'number' as const,
      },
      otherMiscellaneousIncome: {
        label: 'Other Miscellaneous Income',
        placeholder: '50,000',
        validationType: 'number' as const,
      },
      rentalsOfBuilding: {
        label: 'Rentals of Building',
        placeholder: '150,000',
        validationType: 'number' as const,
      }
    },
    calculatedFields: {
      mainRevenue: {
        label: 'Main Revenue',
        tooltip: 'Total revenue from main activity plus inventory changes'
      },
      secondaryRevenue: {
        label: 'Secondary Revenue',
        tooltip: 'Other income and rentals'
      },
      totalRevenue: {
        label: 'Total Revenue',
        tooltip: 'Sum of main revenue and secondary revenue'
      }
    }
  };

  intermediateConsumptionData = {
    title: 'Intermediate Consumption',
    cogsSubtitle: 'COGS',
    generalAdminSubtitle: 'GENERAL & ADMINISTRATIVE EXPENSES',
    fields: {
      totalCostOfProduction: {
        label: 'Total Cost of Production',
        placeholder: '2,000,000',
        validationType: 'number' as const,
      },
      wagesSalariesBonusesCogs: {
        label: 'Wages, Salaries & Bonuses (in Cash)',
        placeholder: '500,000',
        validationType: 'number' as const,
      },
      benefitsGrantedEmployeesCogs: {
        label: 'Benefits Granted to Employees',
        placeholder: '100,000',
        validationType: 'number' as const,
      },
      depreciationCogs: {
        label: 'Depreciation',
        placeholder: '150,000',
        validationType: 'number' as const,
      },
      totalGeneralAdminExpenses: {
        label: 'Total General & Administrative Expenses',
        placeholder: '1,200,000',
        validationType: 'number' as const,
      },
      wagesSalariesBonusesAdmin: {
        label: 'Wages, Salaries & Bonuses (in Cash)',
        placeholder: '300,000',
        validationType: 'number' as const,
      },
      benefitsGrantedEmployeesAdmin: {
        label: 'Benefits Granted to Employees',
        placeholder: '80,000',
        validationType: 'number' as const,
      },
      depreciationAdmin: {
        label: 'Depreciation',
        placeholder: '120,000',
        validationType: 'number' as const,
      },
      bankingCharges: {
        label: 'Banking Charges',
        placeholder: '50,000',
        validationType: 'number' as const,
      }
    },
    calculatedFields: {
      totalIntermediateConsumption: {
        label: 'Total Intermediate Consumption',
        tooltip: 'Sum of all costs and expenses'
      }
    }
  };

  valueAddedData = {
    title: 'Value Added',
    calculatedFields: {
      totalRevenue: {
        label: 'Total Revenue',
        tooltip: 'Total revenue from all sources'
      },
      totalIntermediateConsumption: {
        label: 'Total Intermediate Consumption',
        tooltip: 'Total costs and expenses'
      },
      valueAdded: {
        label: 'Value Added',
        tooltip: 'Total Revenue minus Total Intermediate Consumption'
      }
    }
  };

  averageEmployeesData = {
    title: 'Average Employees',
    fields: {
      averageEmployees: {
        label: 'Average Employees',
        placeholder: '108',
        validationType: 'number' as const,
      }
    }
  };

  scoreSummaryData = {
    title: 'Productivity Score Summary',
    staticValues: {
      valueAdded: {
        label: 'Value Added'
      },
      averageEmployees: {
        label: 'Average Employees'
      },
      productivityPerEmployee: {
        label: 'Productivity (per employee)'
      }
    },
    benchmarkInfo: {
      industryBenchmark: 'Industry Benchmark: 1.14x above Food & Beverage industry average',
      yearOverYear: 'Year-over-Year: +14.1% improvement from last year (52,000 AED)'
    }
  };

  // Calculation methods using evaluation service
  calculateAppProductTotalMainRevenue(
    appProductRevenueMain: number,
    appProductFinishedgoodsBoy: number,
    appProductFinishedgoodsEoy: number,
    appProductWipBoy: number,
    appProductWipEoy: number
  ): number {
    return this.evaluationCalculations.calculateAppProductTotalMainRevenue(
      appProductRevenueMain,
      appProductFinishedgoodsBoy,
      appProductFinishedgoodsEoy,
      appProductWipBoy,
      appProductWipEoy
    );
  }

  calculateAppProductTotalSecondaryRevenue(
    appProductRevenueRentals: number,
    appProductRevenueMisc: number
  ): number {
    return this.evaluationCalculations.calculateAppProductTotalSecondaryRevenue(
      appProductRevenueRentals,
      appProductRevenueMisc
    );
  }

  calculateAppProductTotalRevenue(
    appProductTotalMainRevenue: number,
    appProductTotalSecondaryRevenue: number
  ): number {
    return this.evaluationCalculations.calculateAppProductTotalRevenue(
      appProductTotalMainRevenue,
      appProductTotalSecondaryRevenue
    );
  }

  calculateAppProductIntermediateConsumptionTotal(
    appTotalCostofProduction: number,
    appProductWagesSalariesBonusesCashCogs: number,
    appProductBenefitsGrantedEmpCogs: number,
    appDepreciationCogs: number,
    appProductTotalGeneralAdminExpenses: number,
    appProductWagesSalariesBonusesCashGa: number,
    appProductBenefitsGrantedEmpGa: number,
    appDepreciationGa: number,
    appProductBankingCharges: number
  ): number {
    return this.evaluationCalculations.calculateAppProductIntermediateConsumptionTotal(
      appTotalCostofProduction,
      appProductWagesSalariesBonusesCashCogs,
      appProductBenefitsGrantedEmpCogs,
      appDepreciationCogs,
      appProductTotalGeneralAdminExpenses,
      appProductWagesSalariesBonusesCashGa,
      appProductBenefitsGrantedEmpGa,
      appDepreciationGa,
      appProductBankingCharges
    );
  }

  calculateAppProductValueAdded(
    appProductTotalRevenue: number,
    appProductIntermediateConsumptionTotal: number
  ): number {
    return this.evaluationCalculations.calculateAppProductValueAdded(
      appProductTotalRevenue,
      appProductIntermediateConsumptionTotal
    );
  }

  calculateAppProductProductivity(
    appProductValueAdded: number,
    appProductAvgNumberEmployees: number
  ): number {
    return this.evaluationCalculations.calculateAppProductProductivity(
      appProductValueAdded,
      appProductAvgNumberEmployees
    );
  }

  get mainRevenue(): number {
    const mainActivity = parseFloat(this.totalRevenueMainActivityControl.value || '0');
    const finishedBegin = parseFloat(this.finishedGoodsBeginningControl.value || '0');
    const finishedEnd = parseFloat(this.finishedGoodsEndControl.value || '0');
    const wipBegin = parseFloat(this.workInProgressBeginningControl.value || '0');
    const wipEnd = parseFloat(this.workInProgressEndControl.value || '0');
    
    return this.calculateAppProductTotalMainRevenue(
      mainActivity,
      finishedBegin,
      finishedEnd,
      wipBegin,
      wipEnd
    );
  }

  get secondaryRevenue(): number {
    const otherIncome = parseFloat(this.otherMiscellaneousIncomeControl.value || '0');
    const rentals = parseFloat(this.rentalsOfBuildingControl.value || '0');
    
    return this.calculateAppProductTotalSecondaryRevenue(rentals, otherIncome);
  }

  get totalRevenue(): number {
    return this.calculateAppProductTotalRevenue(this.mainRevenue, this.secondaryRevenue);
  }

  get totalIntermediateConsumption(): number {
    const totalCostProduction = parseFloat(this.totalCostOfProductionControl.value || '0');
    const wagesCogs = parseFloat(this.wagesSalariesBonusesCogsControl.value || '0');
    const benefitsCogs = parseFloat(this.benefitsGrantedEmployeesCogsControl.value || '0');
    const depreciationCogs = parseFloat(this.depreciationCogsControl.value || '0');
    const totalAdminExpenses = parseFloat(this.totalGeneralAdminExpensesControl.value || '0');
    const wagesAdmin = parseFloat(this.wagesSalariesBonusesAdminControl.value || '0');
    const benefitsAdmin = parseFloat(this.benefitsGrantedEmployeesAdminControl.value || '0');
    const depreciationAdmin = parseFloat(this.depreciationAdminControl.value || '0');
    const bankingCharges = parseFloat(this.bankingChargesControl.value || '0');
    
    return this.calculateAppProductIntermediateConsumptionTotal(
      totalCostProduction,
      wagesCogs,
      benefitsCogs,
      depreciationCogs,
      totalAdminExpenses,
      wagesAdmin,
      benefitsAdmin,
      depreciationAdmin,
      bankingCharges
    );
  }

  get valueAdded(): number {
    return this.calculateAppProductValueAdded(this.totalRevenue, this.totalIntermediateConsumption);
  }

  get productivityScore(): number {
    const avgEmployees = parseFloat(this.averageEmployeesControl.value || '1');
    return this.calculateAppProductProductivity(this.valueAdded, avgEmployees);
  }

  // Formatted getters for display in template
  get formattedValueAdded(): string {
    return `${this.valueAdded.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} AED`;
  }

  get formattedAverageEmployees(): string {
    const avgEmployees = parseFloat(this.averageEmployeesControl.value || '0');
    return avgEmployees.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  get formattedProductivityPerEmployee(): string {
    return `${this.productivityScore.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} AED`;
  }
}
