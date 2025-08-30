import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../../components/ui/input/input.component';
import { InputCalculatedComponent } from '../../../../../../components/ui/input-calculated/input-calculated.component';
import { EvaluationCalculationsService } from '../../../../../../services/evaluation-calculations.service';
import { EvaluationFormStateService } from '../../../../../../services/evaluation-form-state.service';

@Component({
  selector: 'app-economic-impact-sub-stage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, InputCalculatedComponent],
  templateUrl: './economic-impact-sub-stage.component.html',
  styleUrl: './economic-impact-sub-stage.component.scss'
})
export class EconomicImpactSubStageComponent implements OnInit {
  @Input() readOnly: boolean = false;
  
  constructor(
    private evaluationCalculations: EvaluationCalculationsService,
    private formStateService: EvaluationFormStateService
  ) {}
  
  ngOnInit() {
    // Load saved form data
    this.loadFormData();

    if (this.readOnly) {
      this.grossBookValueAbuDhabiControl.disable();
      this.totalGrossBookValueControl.disable();
      this.salaryBenefitsEmiratiControl.disable();
      this.totalSpentManpowerControl.disable();
      this.originalEmiratiNumberControl.disable();
      this.growthEmiratiNumberControl.disable();
      this.totalStaffControl.disable();
      this.skilledStaffControl.disable();
      this.adLogisticsFeesControl.disable();
      this.uaeLogisticsFeesControl.disable();
    } else {
      // Set up form value change listeners to save data automatically
      this.setupFormValueListeners();
    }
  }

  /**
   * Load form data from the state service
   */
  private loadFormData(): void {
    const savedData = this.formStateService.getEconomicImpactData();
    
    this.grossBookValueAbuDhabiControl.setValue(savedData.grossBookValueAbuDhabi);
    this.totalGrossBookValueControl.setValue(savedData.totalGrossBookValue);
    this.salaryBenefitsEmiratiControl.setValue(savedData.salaryBenefitsEmirati);
    this.totalSpentManpowerControl.setValue(savedData.totalSpentManpower);
    this.originalEmiratiNumberControl.setValue(savedData.originalEmiratiNumber);
    this.growthEmiratiNumberControl.setValue(savedData.growthEmiratiNumber);
    this.totalStaffControl.setValue(savedData.totalStaff);
    this.skilledStaffControl.setValue(savedData.skilledStaff);
    this.adLogisticsFeesControl.setValue(savedData.adLogisticsFees);
    this.uaeLogisticsFeesControl.setValue(savedData.uaeLogisticsFees);

    console.log('📥 Economic Impact form data loaded from state service');
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
   * Save form data to the state service
   */
  private saveFormData(): void {
    const formData = {
      grossBookValueAbuDhabi: this.grossBookValueAbuDhabiControl.value || '0',
      totalGrossBookValue: this.totalGrossBookValueControl.value || '0',
      salaryBenefitsEmirati: this.salaryBenefitsEmiratiControl.value || '0',
      totalSpentManpower: this.totalSpentManpowerControl.value || '0',
      originalEmiratiNumber: this.originalEmiratiNumberControl.value || '0',
      growthEmiratiNumber: this.growthEmiratiNumberControl.value || '0',
      totalStaff: this.totalStaffControl.value || '0',
      skilledStaff: this.skilledStaffControl.value || '0',
      adLogisticsFees: this.adLogisticsFeesControl.value || '0',
      uaeLogisticsFees: this.uaeLogisticsFeesControl.value || '0'
    };

    this.formStateService.updateEconomicImpactData(formData);
    console.log('💾 Economic Impact form data saved');
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
    this.formStateService.resetEconomicImpactData();
    this.loadFormData();
    console.log('🔄 Economic Impact form data reset');
  }

  /**
   * Public method to check if form has unsaved changes
   */
  public hasUnsavedChanges(): boolean {
    return this.formStateService.hasUnsavedChanges();
  }
  // Investment Form Controls
  grossBookValueAbuDhabiControl = new FormControl('0');
  totalGrossBookValueControl = new FormControl('0');
  
  // Manpower & Emiratisation Form Controls
  salaryBenefitsEmiratiControl = new FormControl('0');
  totalSpentManpowerControl = new FormControl('0');
  originalEmiratiNumberControl = new FormControl('0');
  growthEmiratiNumberControl = new FormControl('0');
  totalStaffControl = new FormControl('0');
  skilledStaffControl = new FormControl('0');
  
  // Logistics Form Controls
  adLogisticsFeesControl = new FormControl('0');
  uaeLogisticsFeesControl = new FormControl('0');

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
        score: Math.round(allScores.investment.appInvestmentScore * 100),
        weight: Math.round(config.investmentWeightedScoreMultiplier * 100) + '%',
        result: allScores.investment.appInvestmentWeightedScore.toFixed(2)
      },
      {
        component: 'Investment Top-Up',
        score: Math.round(allScores.investment.appInvestmentTopUpGbvAdScore * 100),
        weight: '10%', // Static for top-up
        result: (allScores.investment.appInvestmentTopUpGbvAdScore * 0.1).toFixed(2)
      },
      {
        component: 'Emiratization - Salary',
        score: Math.round(allScores.emiratization.appEmiratizationSalaryBenefitsScore * 100),
        weight: Math.round(config.emiratizationPercentageMultiplier * 100) + '%',
        result: (allScores.emiratization.appEmiratizationSalaryBenefitsScore * config.emiratizationPercentageMultiplier).toFixed(2)
      },
      {
        component: 'Emiratization - Growth',
        score: Math.round(allScores.emiratization.appEmiratizationNoScore * 100),
        weight: Math.round(config.emiratizationNoWeightedMultiplier * 100) + '%',
        result: allScores.emiratization.appEmiratizationNoWeightedScore.toFixed(2)
      },
      {
        component: 'Skilled Staff',
        score: Math.round(allScores.emiratization.appSkilledStaffScore * 100),
        weight: Math.round(config.skilledStaffWeightedMultiplier * 100) + '%',
        result: allScores.emiratization.appSkilledStaffWeightedScore.toFixed(2)
      },
      {
        component: 'Supply Chain',
        score: Math.round(allScores.logistics.appLogisticsSupplyChainSupportScore * 100),
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

}
