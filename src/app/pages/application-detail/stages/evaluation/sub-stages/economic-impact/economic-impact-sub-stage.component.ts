import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../../components/ui/input/input.component';
import { InputCalculatedComponent } from '../../../../../../components/ui/input-calculated/input-calculated.component';
import { EvaluationCalculationsService } from '../../../../../../services/evaluation-calculations.service';
import { EvaluationDataService } from '../../../../../../services/evaluation-data.service';

@Component({
  selector: 'app-economic-impact-sub-stage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, InputCalculatedComponent],
  templateUrl: './economic-impact-sub-stage.component.html',
  styleUrl: './economic-impact-sub-stage.component.scss'
})
export class EconomicImpactSubStageComponent implements OnInit, OnChanges {
  @Input() readOnly: boolean = false;
  @Input() evaluation: any = null;
  @Input() evaluationConfiguration: any = null;
  
  
  constructor(
    private evaluationCalculations: EvaluationCalculationsService,
    private evaluationDataService: EvaluationDataService
  ) {}
  
  ngOnInit() {
    console.log('🔍 Economic Impact - ngOnInit called with readOnly:', this.readOnly);
    this.initializeFormControls();
    this.initializeFormData();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('🔍 Economic Impact - ngOnChanges called:', {
      readOnly: this.readOnly,
      changes: changes,
      hasReadOnlyChange: !!changes['readOnly'],
      hasEvaluationChange: !!changes['evaluation']
    });
    
    if (changes['readOnly']) {
      this.initializeFormControls();
    }
    
    if (changes['evaluation'] || changes['readOnly']) {
      this.initializeFormData();
    }
  }

  /**
   * Initialize FormControls with proper disabled state
   */
  private initializeFormControls(): void {
    console.log('🔧 Economic Impact - initializing FormControls with readOnly:', this.readOnly);
    
    // Initialize all FormControls with proper disabled state
    this.grossBookValueAbuDhabiControl = new FormControl({
      value: '0',
      disabled: this.readOnly
    });
    
    this.totalGrossBookValueControl = new FormControl({
      value: '0', 
      disabled: this.readOnly
    });
    
    this.salaryBenefitsEmiratiControl = new FormControl({
      value: '0',
      disabled: this.readOnly
    });
    
    this.totalSpentManpowerControl = new FormControl({
      value: '0',
      disabled: this.readOnly
    });
    
    this.originalEmiratiNumberControl = new FormControl({
      value: '0',
      disabled: this.readOnly
    });
    
    this.growthEmiratiNumberControl = new FormControl({
      value: '0',
      disabled: this.readOnly
    });
    
    this.totalStaffControl = new FormControl({
      value: '0',
      disabled: this.readOnly
    });
    
    this.skilledStaffControl = new FormControl({
      value: '0',
      disabled: this.readOnly
    });
    
    this.adLogisticsFeesControl = new FormControl({
      value: '0',
      disabled: this.readOnly
    });
    
    this.uaeLogisticsFeesControl = new FormControl({
      value: '0',
      disabled: this.readOnly
    });
    
    console.log('✅ Economic Impact - FormControls initialized');
  }

  private initializeFormData() {
    console.log('🔍 Economic Impact - initializeFormData called with readOnly:', this.readOnly);
    
    // Set readonly state in the centralized service
    this.evaluationDataService.setReadOnlyState(this.readOnly);
    
    // Load data from evaluation API if available, otherwise load saved form data
    if (this.evaluation) {
      this.loadFromApiData();
    } else {
      this.loadFormData();
    }

    // Load configuration if provided
    if (this.evaluationConfiguration) {
      this.loadEvaluationConfiguration(this.evaluationConfiguration);
    }

    // Handle readonly state by disabling FormControls
    if (this.readOnly) {
      this.disableAllFormControls();
      console.log('🔒 Economic Impact - All FormControls disabled for readonly mode');
    } else {
      this.enableAllFormControls();
      this.setupFormValueListeners();
      console.log('🔓 Economic Impact - All FormControls enabled and listeners set up');
    }
  }

  /**
   * Load form data from API evaluation data
   */
  private loadFromApiData(): void {
    if (!this.evaluation) return;
    
    this.grossBookValueAbuDhabiControl.setValue((this.evaluation.appInvestmentGbvAdfaAd || 0).toString());
    this.totalGrossBookValueControl.setValue((this.evaluation.appInvestmentGbvTotalProprities || 0).toString());
    this.salaryBenefitsEmiratiControl.setValue((this.evaluation.appEmairatizationSalaryBenfCostPaid || 0).toString());
    this.totalSpentManpowerControl.setValue((this.evaluation.appEmiratizationSpentOnManpower || 0).toString());
    this.originalEmiratiNumberControl.setValue((this.evaluation.appEmiratizationNumberOfEmiratis || 0).toString());
    this.growthEmiratiNumberControl.setValue((this.evaluation.appEmiratizationGrowthInEmiratiNo || 0).toString());
    this.totalStaffControl.setValue((this.evaluation.appSkilledNumberOfStaffTotal || 0).toString());
    this.skilledStaffControl.setValue((this.evaluation.appSkilledNumberOfStaff || 0).toString());
    this.adLogisticsFeesControl.setValue((this.evaluation.appLogisticsFeesChargesAd || 0).toString());
    this.uaeLogisticsFeesControl.setValue((this.evaluation.appLogisticsFeesChargesUaeTotal || 0).toString());

    // Also update the centralized service with API data
    const formData = {
      grossBookValueAbuDhabi: this.evaluation.appInvestmentGbvAdfaAd || 0,
      grossBookValueTotal: this.evaluation.appInvestmentGbvTotalProprities || 0,
      salaryBenefitsEmirati: this.evaluation.appEmairatizationSalaryBenfCostPaid || 0,
      totalSpentManpower: this.evaluation.appEmiratizationSpentOnManpower || 0,
      originalEmiratiNumber: this.evaluation.appEmiratizationNumberOfEmiratis || 0,
      growthEmiratiNumber: this.evaluation.appEmiratizationGrowthInEmiratiNo || 0,
      totalStaff: this.evaluation.appSkilledNumberOfStaffTotal || 0,
      skilledStaff: this.evaluation.appSkilledNumberOfStaff || 0,
      adLogisticsFees: this.evaluation.appLogisticsFeesChargesAd || 0,
      uaeLogisticsFees: this.evaluation.appLogisticsFeesChargesUaeTotal || 0
    };
    this.evaluationDataService.updateFormData(formData);

    console.log('📥 Economic Impact form data loaded from API evaluation data');
  }

  /**
   * Load form data from the centralized data service
   */
  private loadFormData(): void {
    const savedData = this.evaluationDataService.getEconomicImpactData();
    
    this.grossBookValueAbuDhabiControl.setValue(savedData.grossBookValueAbuDhabi?.toString() || '0');
    this.totalGrossBookValueControl.setValue(savedData.grossBookValueTotal?.toString() || '0');
    this.salaryBenefitsEmiratiControl.setValue(savedData.salaryBenefitsEmirati?.toString() || '0');
    this.totalSpentManpowerControl.setValue(savedData.totalSpentManpower?.toString() || '0');
    this.originalEmiratiNumberControl.setValue(savedData.originalEmiratiNumber?.toString() || '0');
    this.growthEmiratiNumberControl.setValue(savedData.growthEmiratiNumber?.toString() || '0');
    this.totalStaffControl.setValue(savedData.totalStaff?.toString() || '0');
    this.skilledStaffControl.setValue(savedData.skilledStaff?.toString() || '0');
    this.adLogisticsFeesControl.setValue(savedData.adLogisticsFees?.toString() || '0');
    this.uaeLogisticsFeesControl.setValue(savedData.uaeLogisticsFees?.toString() || '0');

    console.log('📥 Economic Impact form data loaded from centralized data service');
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

    this.grossBookValueAbuDhabiControl.valueChanges.subscribe(() => debouncedSave());
    this.totalGrossBookValueControl.valueChanges.subscribe(() => debouncedSave());
    this.salaryBenefitsEmiratiControl.valueChanges.subscribe(() => debouncedSave());
    this.totalSpentManpowerControl.valueChanges.subscribe(() => debouncedSave());
    this.originalEmiratiNumberControl.valueChanges.subscribe(() => debouncedSave());
    this.growthEmiratiNumberControl.valueChanges.subscribe(() => debouncedSave());
    this.totalStaffControl.valueChanges.subscribe(() => debouncedSave());
    this.skilledStaffControl.valueChanges.subscribe(() => debouncedSave());
    this.adLogisticsFeesControl.valueChanges.subscribe(() => debouncedSave());
    this.uaeLogisticsFeesControl.valueChanges.subscribe(() => debouncedSave());

    console.log('🔄 Form value change listeners set up for Economic Impact component');
  }

  /**
   * Save form data to the centralized data service
   */
  private saveFormData(): void {
    const formData = {
      grossBookValueAbuDhabi: Number(this.grossBookValueAbuDhabiControl.value) || 0,
      grossBookValueTotal: Number(this.totalGrossBookValueControl.value) || 0,
      salaryBenefitsEmirati: Number(this.salaryBenefitsEmiratiControl.value) || 0,
      totalSpentManpower: Number(this.totalSpentManpowerControl.value) || 0,
      originalEmiratiNumber: Number(this.originalEmiratiNumberControl.value) || 0,
      growthEmiratiNumber: Number(this.growthEmiratiNumberControl.value) || 0,
      totalStaff: Number(this.totalStaffControl.value) || 0,
      skilledStaff: Number(this.skilledStaffControl.value) || 0,
      adLogisticsFees: Number(this.adLogisticsFeesControl.value) || 0,
      uaeLogisticsFees: Number(this.uaeLogisticsFeesControl.value) || 0
    };

    this.evaluationDataService.updateFormData(formData);
    console.log('💾 Economic Impact form data saved to centralized service');
  }

  /**
   * Public method to manually save form data
   */
  public saveFormDataManually(): void {
    this.saveFormData();
  }

  /**
   * Public method to reset form to default values
   */
  public resetFormData(): void {
    this.evaluationDataService.resetFormData();
    this.loadFormData();
    console.log('🔄 Economic Impact form data reset');
  }

  /**
   * Public method to check if form has unsaved changes
   */
  public hasUnsavedChanges(): boolean {
    return this.evaluationDataService.hasUnsavedChanges();
  }
  // Investment Form Controls
  grossBookValueAbuDhabiControl!: FormControl;
  totalGrossBookValueControl!: FormControl;
  
  // Manpower & Emiratisation Form Controls
  salaryBenefitsEmiratiControl!: FormControl;
  totalSpentManpowerControl!: FormControl;
  originalEmiratiNumberControl!: FormControl;
  growthEmiratiNumberControl!: FormControl;
  totalStaffControl!: FormControl;
  skilledStaffControl!: FormControl;
  
  // Logistics Form Controls
  adLogisticsFeesControl!: FormControl;
  uaeLogisticsFeesControl!: FormControl;

  // Investment Section Data
  investmentData = {
    title: 'Investment',
    fields: {
      grossBookValueAbuDhabi: {
        label: 'Gross Book Value of the Fixed Assets & Investment Properties in Abu Dhabi',
        placeholder: '20,000,000',
        validationType: 'number' as const,
      },
      totalGrossBookValue: {
        label: 'Total Gross Book Value of the Fixed Assets & Investment Properties',
        placeholder: '50,000,000',
        validationType: 'number' as const,
      }
    },
    calculatedFields: {
      investmentScore: {
        label: 'Investment Score',
        tooltip: 'Calculated based on gross book value ratios and investment metrics'
      },
      investmentTopUpScore: {
        label: 'Investment Top-Up Score',
        tooltip: 'Additional investment scoring based on total investment value'
      }
    }
  };

  // Manpower & Emiratisation Section Data
  manpowerData = {
    title: 'Manpower & Emiratisation',
    fields: {
      salaryBenefitsEmirati: {
        label: 'Salary & Benefits Cost Paid to Emirati Employees in Abu Dhabi',
        placeholder: '2,500,000',
        validationType: 'number' as const,
      },
      totalSpentManpower: {
        label: 'Total Spent on Manpower',
        placeholder: '10,000,000',
        validationType: 'number' as const,
      },
      originalEmiratiNumber: {
        label: 'Original Number of Emiratis',
        placeholder: '8',
        validationType: 'number' as const,
      },
      growthEmiratiNumber: {
        label: 'Growth In Emirati No\'s',
        placeholder: '12',
        validationType: 'number' as const,
      },
      totalStaff: {
        label: 'Total Number of Staff',
        placeholder: '150',
        validationType: 'number' as const,
      },
      skilledStaff: {
        label: 'Number of Skilled Staff',
        placeholder: '90',
        validationType: 'number' as const,
      }
    },
    calculatedFields: {
      emiratisationSalaryScore: {
        label: 'Emiratisation: Salary & Benefits Score',
        tooltip: 'Score based on salary and benefits paid to Emirati employees'
      },
      emiratisationGrowthScore: {
        label: 'Emiratisation: Growth Score',
        tooltip: 'Score based on growth in number of Emirati employees'
      },
      skilledLabourScore: {
        label: 'Skilled Labour Score',
        tooltip: 'Score based on percentage of skilled staff'
      }
    }
  };

  // Logistics Section Data
  logisticsData = {
    title: 'Logistics',
    fields: {
      adLogisticsFees: {
        label: 'AD Logistics fees & charges',
        placeholder: '1,200,000',
        validationType: 'number' as const,
      },
      uaeLogisticsFees: {
        label: 'UAE Total Logistics fees & Charges',
        placeholder: '3,000,000',
        validationType: 'number' as const,
      }
    },
    calculatedFields: {
      supplyChainScore: {
        label: 'Supply Chain Support Score',
        tooltip: 'Score based on logistics spending in Abu Dhabi vs UAE total'
      }
    }
  };

  // Economic Impact Score Summary Data
  scoreSummaryData = {
    title: 'Economic Impact Score Summary',
    headers: ['Component', 'Score', 'Weight', 'Result'],
    totalScore: 86.0
  };

  // Investment Score Calculation Method
  calculateAppInvestmentScore(
    appInvestmentGbvAdfaAd: number,
    appInvestmentGbvTotalProprities: number
  ): number {
    return this.evaluationCalculations.calculateAppInvestmentScore(appInvestmentGbvAdfaAd, appInvestmentGbvTotalProprities);
  }

  calculateAppInvestmentWeightedScore(appInvestmentScore: number): number {
    return this.evaluationCalculations.calculateAppInvestmentWeightedScore(appInvestmentScore);
  }

  calculateAppInvestmentTopUpGbvAdScore(appInvestmentGbvAdfaAd: number): number {
    return this.evaluationCalculations.calculateAppInvestmentTopUpGbvAdScore(appInvestmentGbvAdfaAd);
  }

  calculateAppEmiratizationSalaryBenefitsScore(appEmairatizationSalaryBenfCostPaid: number, appEmiratizationSpentOnManpower: number): number {
    return this.evaluationCalculations.calculateAppEmiratizationSalaryBenefitsScore(appEmairatizationSalaryBenfCostPaid, appEmiratizationSpentOnManpower);
  }

  calculateAppEmiratizationNoScore(appEmiratizationGrowthInEmiratiNo: number, appEmiratizationNumberOfEmiratis: number): number {
    return this.evaluationCalculations.calculateAppEmiratizationNoScore(appEmiratizationGrowthInEmiratiNo, appEmiratizationNumberOfEmiratis);
  }

  calculateAppEmiratizationNoWeightedScore(appEmiratizationNoScore: number): number {
    return this.evaluationCalculations.calculateAppEmiratizationNoWeightedScore(appEmiratizationNoScore);
  }

  calculateAppSkilledStaffScore(appSkilledNumberOfStaff: number, appSkilledNumberOfStaffTotal: number): number {
    return this.evaluationCalculations.calculateAppSkilledStaffScore(appSkilledNumberOfStaff, appSkilledNumberOfStaffTotal);
  }

  calculateAppSkilledStaffWeightedScore(appSkilledStaffScore: number): number {
    return this.evaluationCalculations.calculateAppSkilledStaffWeightedScore(appSkilledStaffScore);
  }

  calculateAppLogisticsSupplyChainSupportScore(appLogisticsFeesChargesAd: number, appLogisticsFeesChargesUaeTotal: number): number {
    return this.evaluationCalculations.calculateAppLogisticsSupplyChainSupportScore(appLogisticsFeesChargesAd, appLogisticsFeesChargesUaeTotal);
  }

  calculateAppLogisticsSupplyChainSupportWeightedScore(appLogisticsSupplyChainSupportScore: number): number {
    return this.evaluationCalculations.calculateAppLogisticsSupplyChainSupportWeightedScore(appLogisticsSupplyChainSupportScore);
  }

  // Utility methods for comprehensive calculations
  getAllInvestmentScores(): {
    appInvestmentScore: number;
    appInvestmentWeightedScore: number;
    appInvestmentTopUpGbvAdScore: number;
  } {
    const abuDhabiValue = parseFloat(this.grossBookValueAbuDhabiControl.value || '0');
    const totalValue = parseFloat(this.totalGrossBookValueControl.value || '0');
    
    return this.evaluationCalculations.calculateAllInvestmentScores(abuDhabiValue, totalValue);
  }

  getAllEmiratizationScores(): {
    appEmiratizationSalaryBenefitsScore: number;
    appEmiratizationNoScore: number;
    appEmiratizationNoWeightedScore: number;
    appSkilledStaffScore: number;
    appSkilledStaffWeightedScore: number;
  } {
    const emiratiSalary = parseFloat(this.salaryBenefitsEmiratiControl.value || '0');
    const totalManpower = parseFloat(this.totalSpentManpowerControl.value || '0');
    const growthEmirati = parseFloat(this.growthEmiratiNumberControl.value || '0');
    const originalEmirati = parseFloat(this.originalEmiratiNumberControl.value || '0');
    const skilledStaff = parseFloat(this.skilledStaffControl.value || '0');
    const totalStaff = parseFloat(this.totalStaffControl.value || '0');

    return this.evaluationCalculations.calculateAllEmiratizationScores(
      emiratiSalary,
      totalManpower,
      growthEmirati,
      originalEmirati,
      skilledStaff,
      totalStaff
    );
  }

  getAllLogisticsScores(): {
    appLogisticsSupplyChainSupportScore: number;
    appLogisticsSupplyChainSupportWeightedScore: number;
  } {
    const adLogistics = parseFloat(this.adLogisticsFeesControl.value || '0');
    const uaeLogistics = parseFloat(this.uaeLogisticsFeesControl.value || '0');

    return this.evaluationCalculations.calculateAllLogisticsScores(adLogistics, uaeLogistics);
  }

  // Method to get all calculated scores at once
  getAllEconomicImpactScores(): {
    investment: ReturnType<typeof this.getAllInvestmentScores>;
    emiratization: ReturnType<typeof this.getAllEmiratizationScores>;
    logistics: ReturnType<typeof this.getAllLogisticsScores>;
    totalScore: number;
  } {
    const investment = this.getAllInvestmentScores();
    const emiratization = this.getAllEmiratizationScores();
    const logistics = this.getAllLogisticsScores();

    // Calculate total weighted score
    const totalScore = 
      investment.appInvestmentWeightedScore +
      emiratization.appEmiratizationNoWeightedScore +
      emiratization.appSkilledStaffWeightedScore +
      logistics.appLogisticsSupplyChainSupportWeightedScore;

    return {
      investment,
      emiratization,
      logistics,
      totalScore: Math.round(totalScore * 100) / 100 // Round to 2 decimal places
    };
  }

  // Method to validate calculations against expected values
  validateCalculations(expectedScores: any): { [key: string]: boolean } {
    const currentScores = this.getAllEconomicImpactScores();
    const validations: { [key: string]: boolean } = {};

    // Validate investment scores
    if (expectedScores.investment) {
      validations['investmentScore'] = this.evaluationCalculations.validateCalculatedScore(
        currentScores.investment.appInvestmentScore,
        expectedScores.investment.appInvestmentScore
      );
    }

    // Validate emiratization scores
    if (expectedScores.emiratization) {
      validations['emiratizationSalaryScore'] = this.evaluationCalculations.validateCalculatedScore(
        currentScores.emiratization.appEmiratizationSalaryBenefitsScore,
        expectedScores.emiratization.appEmiratizationSalaryBenefitsScore
      );
    }

    // Validate logistics scores
    if (expectedScores.logistics) {
      validations['logisticsScore'] = this.evaluationCalculations.validateCalculatedScore(
        currentScores.logistics.appLogisticsSupplyChainSupportScore,
        expectedScores.logistics.appLogisticsSupplyChainSupportScore
      );
    }

    return validations;
  }

  // Method to get calculation tolerance
  getCalculationTolerance(): number {
    return this.evaluationCalculations.getCalculationTolerance();
  }

  // Method to get current configuration
  getEvaluationConfiguration() {
    return this.evaluationCalculations.getConfiguration();
  }

  // Method to load new configuration
  loadEvaluationConfiguration(config: any): void {
    this.evaluationCalculations.loadConfiguration(config);
  }

  // Enhanced Calculated Investment Scores using comprehensive methods
  get investmentScore(): string {
    const scores = this.getAllInvestmentScores();
    return scores.appInvestmentScore.toFixed(2);
  }

  get investmentWeightedScore(): string {
    const scores = this.getAllInvestmentScores();
    return scores.appInvestmentWeightedScore.toFixed(2);
  }

  get investmentTopUpScore(): string {
    const scores = this.getAllInvestmentScores();
    return scores.appInvestmentTopUpGbvAdScore.toFixed(2);
  }

  // Enhanced Calculated Manpower & Emiratisation Scores using comprehensive methods
  get emiratisationSalaryScore(): string {
    const scores = this.getAllEmiratizationScores();
    return scores.appEmiratizationSalaryBenefitsScore.toFixed(2);
  }

  get emiratisationGrowthScore(): string {
    const scores = this.getAllEmiratizationScores();
    return scores.appEmiratizationNoScore.toFixed(2);
  }

  get emiratisationGrowthWeightedScore(): string {
    const scores = this.getAllEmiratizationScores();
    return scores.appEmiratizationNoWeightedScore.toFixed(2);
  }

  get skilledLabourScore(): string {
    const scores = this.getAllEmiratizationScores();
    return scores.appSkilledStaffScore.toFixed(2);
  }

  get skilledLabourWeightedScore(): string {
    const scores = this.getAllEmiratizationScores();
    return scores.appSkilledStaffWeightedScore.toFixed(2);
  }

  // Enhanced Calculated Logistics Scores using comprehensive methods
  get supplyChainScore(): string {
    const scores = this.getAllLogisticsScores();
    return scores.appLogisticsSupplyChainSupportScore.toFixed(2);
  }

  get supplyChainWeightedScore(): string {
    const scores = this.getAllLogisticsScores();
    return scores.appLogisticsSupplyChainSupportWeightedScore.toFixed(2);
  }

  // Enhanced total economic impact score
  get totalEconomicImpactScore(): string {
    const allScores = this.getAllEconomicImpactScores();
    return allScores.totalScore.toFixed(2);
  }

  // Enhanced Economic Impact Score Summary Table Data using comprehensive calculations
  get scoreSummaryTableData() {
    const allScores = this.getAllEconomicImpactScores();
    const config = this.getEvaluationConfiguration();
    
    return [
      {
        component: 'Investment',
        score: allScores.investment.appInvestmentScore.toFixed(2),
        weight: Math.round(config.investmentWeightedScoreMultiplier * 100) + '%',
        result: allScores.investment.appInvestmentWeightedScore.toFixed(2)
      },
      {
        component: 'Investment Top-Up',
        score: allScores.investment.appInvestmentTopUpGbvAdScore.toFixed(2),
        weight: '10%', // Static for top-up
        result: (allScores.investment.appInvestmentTopUpGbvAdScore * 0.1).toFixed(2)
      },
      {
        component: 'Emiratization - Salary',
        score: allScores.emiratization.appEmiratizationSalaryBenefitsScore.toFixed(2),
        weight: Math.round(config.emiratizationPercentageMultiplier * 100) + '%',
        result: (allScores.emiratization.appEmiratizationSalaryBenefitsScore * config.emiratizationPercentageMultiplier).toFixed(2)
      },
      {
        component: 'Emiratization - Growth',
        score: allScores.emiratization.appEmiratizationNoScore.toFixed(2),
        weight: Math.round(config.emiratizationNoWeightedMultiplier * 100) + '%',
        result: allScores.emiratization.appEmiratizationNoWeightedScore.toFixed(2)
      },
      {
        component: 'Skilled Staff',
        score: allScores.emiratization.appSkilledStaffScore.toFixed(2),
        weight: Math.round(config.skilledStaffWeightedMultiplier * 100) + '%',
        result: allScores.emiratization.appSkilledStaffWeightedScore.toFixed(2)
      },
      {
        component: 'Supply Chain',
        score: allScores.logistics.appLogisticsSupplyChainSupportScore.toFixed(2),
        weight: Math.round(config.logisticsWeightedMultiplier * 100) + '%',
        result: allScores.logistics.appLogisticsSupplyChainSupportWeightedScore.toFixed(2)
      }
    ];
  }

  // Remove duplicate and use the comprehensive total score calculation
  get totalEconomicImpactScoreFromTable(): number {
    return this.scoreSummaryTableData.reduce((total, row) => total + parseFloat(row.result), 0);
  }

  // Debug and monitoring methods
  logAllCalculations(): void {
    const allScores = this.getAllEconomicImpactScores();
    const config = this.getEvaluationConfiguration();
    
    console.group('🧮 Economic Impact Calculations');
    console.log('📊 Input Values:', {
      grossBookValueAbuDhabi: this.grossBookValueAbuDhabiControl.value,
      totalGrossBookValue: this.totalGrossBookValueControl.value,
      salaryBenefitsEmirati: this.salaryBenefitsEmiratiControl.value,
      totalSpentManpower: this.totalSpentManpowerControl.value,
      originalEmiratiNumber: this.originalEmiratiNumberControl.value,
      growthEmiratiNumber: this.growthEmiratiNumberControl.value,
      totalStaff: this.totalStaffControl.value,
      skilledStaff: this.skilledStaffControl.value,
      adLogisticsFees: this.adLogisticsFeesControl.value,
      uaeLogisticsFees: this.uaeLogisticsFeesControl.value
    });
    
    console.log('⚙️ Configuration:', config);
    console.log('📈 Investment Scores:', allScores.investment);
    console.log('👥 Emiratization Scores:', allScores.emiratization);
    console.log('🚚 Logistics Scores:', allScores.logistics);
    console.log('🎯 Total Score:', allScores.totalScore);
    console.log('📋 Summary Table Data:', this.scoreSummaryTableData);
    console.groupEnd();
  }

  // Method to export calculations as JSON
  exportCalculationsAsJSON(): string {
    const allScores = this.getAllEconomicImpactScores();
    const config = this.getEvaluationConfiguration();
    
    const exportData = {
      timestamp: new Date().toISOString(),
      configuration: config,
      inputValues: {
        grossBookValueAbuDhabi: parseFloat(this.grossBookValueAbuDhabiControl.value || '0'),
        totalGrossBookValue: parseFloat(this.totalGrossBookValueControl.value || '0'),
        salaryBenefitsEmirati: parseFloat(this.salaryBenefitsEmiratiControl.value || '0'),
        totalSpentManpower: parseFloat(this.totalSpentManpowerControl.value || '0'),
        originalEmiratiNumber: parseFloat(this.originalEmiratiNumberControl.value || '0'),
        growthEmiratiNumber: parseFloat(this.growthEmiratiNumberControl.value || '0'),
        totalStaff: parseFloat(this.totalStaffControl.value || '0'),
        skilledStaff: parseFloat(this.skilledStaffControl.value || '0'),
        adLogisticsFees: parseFloat(this.adLogisticsFeesControl.value || '0'),
        uaeLogisticsFees: parseFloat(this.uaeLogisticsFeesControl.value || '0')
      },
      calculatedScores: allScores,
      summaryTable: this.scoreSummaryTableData
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Disable all form controls for readonly mode
   */
  private disableAllFormControls(): void {
    this.grossBookValueAbuDhabiControl.disable({ emitEvent: false });
    this.totalGrossBookValueControl.disable({ emitEvent: false });
    this.salaryBenefitsEmiratiControl.disable({ emitEvent: false });
    this.totalSpentManpowerControl.disable({ emitEvent: false });
    this.originalEmiratiNumberControl.disable({ emitEvent: false });
    this.growthEmiratiNumberControl.disable({ emitEvent: false });
    this.totalStaffControl.disable({ emitEvent: false });
    this.skilledStaffControl.disable({ emitEvent: false });
    this.adLogisticsFeesControl.disable({ emitEvent: false });
    this.uaeLogisticsFeesControl.disable({ emitEvent: false });
  }

  /**
   * Enable all form controls for edit mode
   */
  private enableAllFormControls(): void {
    this.grossBookValueAbuDhabiControl.enable({ emitEvent: false });
    this.totalGrossBookValueControl.enable({ emitEvent: false });
    this.salaryBenefitsEmiratiControl.enable({ emitEvent: false });
    this.totalSpentManpowerControl.enable({ emitEvent: false });
    this.originalEmiratiNumberControl.enable({ emitEvent: false });
    this.growthEmiratiNumberControl.enable({ emitEvent: false });
    this.totalStaffControl.enable({ emitEvent: false });
    this.skilledStaffControl.enable({ emitEvent: false });
    this.adLogisticsFeesControl.enable({ emitEvent: false });
    this.uaeLogisticsFeesControl.enable({ emitEvent: false });
  }

}
