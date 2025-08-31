import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface EvaluationFormData {
  // Economic Impact Data
  grossBookValueAbuDhabi: number;
  grossBookValueTotal: number;
  salaryBenefitsEmirati: number;
  totalSpentManpower: number;
  originalEmiratiNumber: number;
  growthEmiratiNumber: number;
  totalStaff: number;
  skilledStaff: number;
  adLogisticsFees: number;
  uaeLogisticsFees: number;

  // Productivity Data
  totalRevenueMainActivity: number;
  finishedGoodsBeginning: number;
  finishedGoodsEnd: number;
  workInProgressBeginning: number;
  workInProgressEnd: number;
  otherMiscellaneousIncome: number;
  rentalsOfBuilding: number;
  averageEmployees: number;
  totalCostOfProduction: number;
  wagesSalariesBonusesCogs: number;
  benefitsGrantedEmployeesCogs: number;
  depreciationCogs: number;
  totalGeneralAdminExpenses: number;
  wagesSalariesBonusesAdmin: number;
  benefitsGrantedEmployeesAdmin: number;
  depreciationAdmin: number;
  bankingCharges: number;

  // EMS/DMS Data
  connectionLoadMeter: number;
  emsAvailability: string;
  demandSideConsumption: number;

  // General Data
  applicationType: string;
  financialYearEnd: string;
  utilitiesRequired: string[];
}

export interface EvaluationState {
  currentApplicationId?: number;
  formData: EvaluationFormData;
  isReadOnly: boolean;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluationDataService {
  
  private readonly defaultFormData: EvaluationFormData = {
    // Economic Impact defaults
    grossBookValueAbuDhabi: 0,
    grossBookValueTotal: 0,
    salaryBenefitsEmirati: 0,
    totalSpentManpower: 0,
    originalEmiratiNumber: 0,
    growthEmiratiNumber: 0,
    totalStaff: 0,
    skilledStaff: 0,
    adLogisticsFees: 0,
    uaeLogisticsFees: 0,

    // Productivity defaults
    totalRevenueMainActivity: 0,
    finishedGoodsBeginning: 0,
    finishedGoodsEnd: 0,
    workInProgressBeginning: 0,
    workInProgressEnd: 0,
    otherMiscellaneousIncome: 0,
    rentalsOfBuilding: 0,
    averageEmployees: 108,
    totalCostOfProduction: 0,
    wagesSalariesBonusesCogs: 0,
    benefitsGrantedEmployeesCogs: 0,
    depreciationCogs: 0,
    totalGeneralAdminExpenses: 0,
    wagesSalariesBonusesAdmin: 0,
    benefitsGrantedEmployeesAdmin: 0,
    depreciationAdmin: 0,
    bankingCharges: 0,

    // EMS/DMS defaults
    connectionLoadMeter: 0,
    emsAvailability: 'Available',
    demandSideConsumption: 0,

    // General defaults
    applicationType: 'Renewal',
    financialYearEnd: new Date().toISOString().split('T')[0],
    utilitiesRequired: ['Electricity', 'Gas']
  };

  private evaluationState: EvaluationState = {
    formData: { ...this.defaultFormData },
    isReadOnly: false,
    lastUpdated: new Date()
  };

  // BehaviorSubjects for reactive data
  private evaluationStateSubject = new BehaviorSubject<EvaluationState>(this.evaluationState);
  private readOnlyStateSubject = new BehaviorSubject<boolean>(false);

  // Public observables
  public evaluationState$ = this.evaluationStateSubject.asObservable();
  public readOnlyState$ = this.readOnlyStateSubject.asObservable();

  constructor() {
    console.log('📝 EvaluationDataService initialized');
  }

  /**
   * Initialize evaluation data for a specific application
   */
  initializeForApplication(applicationId: number, apiData?: any, isReadOnly: boolean = false): void {
    console.log('🚀 Initializing evaluation data for application:', applicationId);
    
    this.evaluationState = {
      currentApplicationId: applicationId,
      formData: apiData ? this.mapApiDataToFormData(apiData) : { ...this.defaultFormData },
      isReadOnly: isReadOnly,
      lastUpdated: new Date()
    };

    this.evaluationStateSubject.next(this.evaluationState);
    this.readOnlyStateSubject.next(isReadOnly);
  }

  /**
   * Update specific form data
   */
  updateFormData(partialData: Partial<EvaluationFormData>): void {
    if (this.evaluationState.isReadOnly) {
      console.warn('⚠️ Attempted to update form data in readonly mode');
      return;
    }

    this.evaluationState = {
      ...this.evaluationState,
      formData: {
        ...this.evaluationState.formData,
        ...partialData
      },
      lastUpdated: new Date()
    };

    this.evaluationStateSubject.next(this.evaluationState);
    console.log('💾 Form data updated:', partialData);
  }

  /**
   * Get current form data
   */
  getCurrentFormData(): EvaluationFormData {
    return { ...this.evaluationState.formData };
  }

  /**
   * Get specific section data
   */
  getEconomicImpactData() {
    const data = this.evaluationState.formData;
    return {
      grossBookValueAbuDhabi: data.grossBookValueAbuDhabi,
      grossBookValueTotal: data.grossBookValueTotal,
      salaryBenefitsEmirati: data.salaryBenefitsEmirati,
      totalSpentManpower: data.totalSpentManpower,
      originalEmiratiNumber: data.originalEmiratiNumber,
      growthEmiratiNumber: data.growthEmiratiNumber,
      totalStaff: data.totalStaff,
      skilledStaff: data.skilledStaff,
      adLogisticsFees: data.adLogisticsFees,
      uaeLogisticsFees: data.uaeLogisticsFees
    };
  }

  getProductivityData() {
    const data = this.evaluationState.formData;
    return {
      totalRevenueMainActivity: data.totalRevenueMainActivity,
      finishedGoodsBeginning: data.finishedGoodsBeginning,
      finishedGoodsEnd: data.finishedGoodsEnd,
      workInProgressBeginning: data.workInProgressBeginning,
      workInProgressEnd: data.workInProgressEnd,
      otherMiscellaneousIncome: data.otherMiscellaneousIncome,
      rentalsOfBuilding: data.rentalsOfBuilding,
      averageEmployees: data.averageEmployees,
      totalCostOfProduction: data.totalCostOfProduction,
      wagesSalariesBonusesCogs: data.wagesSalariesBonusesCogs,
      benefitsGrantedEmployeesCogs: data.benefitsGrantedEmployeesCogs,
      depreciationCogs: data.depreciationCogs,
      totalGeneralAdminExpenses: data.totalGeneralAdminExpenses,
      wagesSalariesBonusesAdmin: data.wagesSalariesBonusesAdmin,
      benefitsGrantedEmployeesAdmin: data.benefitsGrantedEmployeesAdmin,
      depreciationAdmin: data.depreciationAdmin,
      bankingCharges: data.bankingCharges
    };
  }

  getEmsDmsData() {
    const data = this.evaluationState.formData;
    return {
      connectionLoadMeter: data.connectionLoadMeter,
      emsAvailability: data.emsAvailability,
      demandSideConsumption: data.demandSideConsumption
    };
  }

  getGeneralData() {
    const data = this.evaluationState.formData;
    return {
      applicationType: data.applicationType,
      financialYearEnd: data.financialYearEnd,
      utilitiesRequired: data.utilitiesRequired
    };
  }

  /**
   * Set readonly state
   */
  setReadOnlyState(isReadOnly: boolean): void {
    this.evaluationState.isReadOnly = isReadOnly;
    this.readOnlyStateSubject.next(isReadOnly);
    this.evaluationStateSubject.next(this.evaluationState);
    console.log('🔒 Readonly state updated:', isReadOnly);
  }

  /**
   * Get current readonly state
   */
  isReadOnly(): boolean {
    return this.evaluationState.isReadOnly;
  }

  /**
   * Reset all form data
   */
  resetFormData(): void {
    if (this.evaluationState.isReadOnly) {
      console.warn('⚠️ Cannot reset form data in readonly mode');
      return;
    }

    this.evaluationState = {
      ...this.evaluationState,
      formData: { ...this.defaultFormData },
      lastUpdated: new Date()
    };

    this.evaluationStateSubject.next(this.evaluationState);
    console.log('🔄 Form data reset to defaults');
  }

  /**
   * Check if there are unsaved changes
   */
  hasUnsavedChanges(): boolean {
    // In a real app, you might track this against last saved state
    return false;
  }

  /**
   * Map API data to internal form data structure
   */
  private mapApiDataToFormData(apiData: any): EvaluationFormData {
    const evaluation = apiData.evaluation || {};
    const applicationSummary = apiData.applicationSummary || {};

    return {
      // Economic Impact data from API
      grossBookValueAbuDhabi: evaluation.appInvestmentGbvAdfaAd || 0,
      grossBookValueTotal: evaluation.appInvestmentGbvTotalProprities || 0,
      salaryBenefitsEmirati: evaluation.appEmairatizationSalaryBenfCostPaid || 0,
      totalSpentManpower: evaluation.appEmiratizationSpentOnManpower || 0,
      originalEmiratiNumber: evaluation.appEmiratizationNumberOfEmiratis || 0,
      growthEmiratiNumber: evaluation.appEmiratizationGrowthInEmiratiNo || 0,
      totalStaff: evaluation.appSkilledNumberOfStaffTotal || 0,
      skilledStaff: evaluation.appSkilledNumberOfStaff || 0,
      adLogisticsFees: evaluation.appLogisticsFeesChargesAd || 0,
      uaeLogisticsFees: evaluation.appLogisticsFeesChargesUaeTotal || 0,

      // Productivity data from API
      totalRevenueMainActivity: evaluation.appProductRevenueMain || 0,
      finishedGoodsBeginning: evaluation.appProductFinishedgoodsBoy || 0,
      finishedGoodsEnd: evaluation.aappProductFinishedgoodsEoy || 0,
      workInProgressBeginning: evaluation.appProductWipBoy || 0,
      workInProgressEnd: evaluation.appProductWipEoy || 0,
      otherMiscellaneousIncome: evaluation.appProductRevenueMisc || 0,
      rentalsOfBuilding: evaluation.appProductRevenueRentals || 0,
      averageEmployees: evaluation.appProductAvgNumberEmployees || 108,
      totalCostOfProduction: evaluation.appTotalCostofProduction || 0,
      wagesSalariesBonusesCogs: evaluation.appProductWagesSalariesBonusesCashCogs || 0,
      benefitsGrantedEmployeesCogs: evaluation.appProductBenefitsGrantedEmpCogs || 0,
      depreciationCogs: evaluation.appDepreciationCogs || 0,
      totalGeneralAdminExpenses: evaluation.appProductTotalGeneralAdminExpenses || 0,
      wagesSalariesBonusesAdmin: evaluation.appProductWagesSalariesBonusesCashGa || 0,
      benefitsGrantedEmployeesAdmin: evaluation.appProductBenefitsGrantedEmpGa || 0,
      depreciationAdmin: evaluation.appDepreciationGA || 0,
      bankingCharges: evaluation.appProductBankingCharges || 0,

      // EMS/DMS data from API
      connectionLoadMeter: evaluation.appConnectionLoadMeter || 0,
      emsAvailability: evaluation.appEmsApplicability === 1 ? 'Available' : 'Not Available',
      demandSideConsumption: evaluation.demandSideConsumptionPercentage || 0,

      // General data from API
      applicationType: applicationSummary.appTypeName || 'Renewal',
      financialYearEnd: applicationSummary.appFinancialYearEndData 
        ? new Date(applicationSummary.appFinancialYearEndData).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0],
      utilitiesRequired: this.getUtilitiesFromSummary(applicationSummary)
    };
  }

  private getUtilitiesFromSummary(applicationSummary: any): string[] {
    const utilities = [];
    if (applicationSummary.appIsElectricity) utilities.push('Electricity');
    if (applicationSummary.appIsGas) utilities.push('Gas');
    return utilities.length > 0 ? utilities : ['Electricity', 'Gas'];
  }

  /**
   * Export current data for debugging
   */
  exportCurrentState(): any {
    return {
      timestamp: new Date().toISOString(),
      applicationId: this.evaluationState.currentApplicationId,
      isReadOnly: this.evaluationState.isReadOnly,
      formData: this.evaluationState.formData,
      lastUpdated: this.evaluationState.lastUpdated
    };
  }
}