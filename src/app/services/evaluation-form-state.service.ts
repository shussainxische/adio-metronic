import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { EvaluationDataService, EvaluationFormData } from './evaluation-data.service';

export interface EconomicImpactFormData {
  grossBookValueAbuDhabi: string;
  totalGrossBookValue: string;
  salaryBenefitsEmirati: string;
  totalSpentManpower: string;
  originalEmiratiNumber: string;
  growthEmiratiNumber: string;
  totalStaff: string;
  skilledStaff: string;
  adLogisticsFees: string;
  uaeLogisticsFees: string;
}

export interface ProductivityFormData {
  totalRevenueMainActivity: string;
  finishedGoodsBeginning: string;
  finishedGoodsEnd: string;
  workInProgressBeginning: string;
  workInProgressEnd: string;
  otherMiscellaneousIncome: string;
  rentalsOfBuilding: string;
  averageEmployees: string;
  totalCostOfProduction: string;
  wagesSalariesBonusesCogs: string;
  benefitsGrantedEmployeesCogs: string;
  depreciationCogs: string;
  totalGeneralAdminExpenses: string;
  wagesSalariesBonusesAdmin: string;
  benefitsGrantedEmployeesAdmin: string;
  depreciationAdmin: string;
  bankingCharges: string;
}

export interface EvaluationFormState {
  economicImpact: EconomicImpactFormData;
  productivity: ProductivityFormData;
  lastUpdated: Date;
  currentStep: number;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluationFormStateService {
  // Default empty form data
  private defaultEconomicImpactData: EconomicImpactFormData = {
    grossBookValueAbuDhabi: '0',
    totalGrossBookValue: '0',
    salaryBenefitsEmirati: '0',
    totalSpentManpower: '0',
    originalEmiratiNumber: '0',
    growthEmiratiNumber: '0',
    totalStaff: '0',
    skilledStaff: '0',
    adLogisticsFees: '0',
    uaeLogisticsFees: '0'
  };

  private defaultProductivityData: ProductivityFormData = {
    totalRevenueMainActivity: '0',
    finishedGoodsBeginning: '0',
    finishedGoodsEnd: '0',
    workInProgressBeginning: '0',
    workInProgressEnd: '0',
    otherMiscellaneousIncome: '0',
    rentalsOfBuilding: '0',
    averageEmployees: '108',
    totalCostOfProduction: '0',
    wagesSalariesBonusesCogs: '0',
    benefitsGrantedEmployeesCogs: '0',
    depreciationCogs: '0',
    totalGeneralAdminExpenses: '0',
    wagesSalariesBonusesAdmin: '0',
    benefitsGrantedEmployeesAdmin: '0',
    depreciationAdmin: '0',
    bankingCharges: '0'
  };

  private defaultFormState: EvaluationFormState = {
    economicImpact: this.defaultEconomicImpactData,
    productivity: this.defaultProductivityData,
    lastUpdated: new Date(),
    currentStep: 0
  };

  constructor(private evaluationDataService: EvaluationDataService) {}

  /**
   * Get current form state as observable
   */
  getFormState(): Observable<EvaluationFormState> {
    return this.evaluationDataService.evaluationState$.pipe(
      map(state => this.mapToFormState(state.formData))
    );
  }

  /**
   * Get current form state value
   */
  getCurrentFormState(): EvaluationFormState {
    const currentData = this.evaluationDataService.getCurrentFormData();
    return this.mapToFormState(currentData);
  }

  /**
   * Update economic impact form data
   */
  updateEconomicImpactData(data: Partial<EconomicImpactFormData>): void {
    const updateData: Partial<EvaluationFormData> = {
      grossBookValueAbuDhabi: data.grossBookValueAbuDhabi ? Number(data.grossBookValueAbuDhabi) : undefined,
      grossBookValueTotal: data.totalGrossBookValue ? Number(data.totalGrossBookValue) : undefined,
      salaryBenefitsEmirati: data.salaryBenefitsEmirati ? Number(data.salaryBenefitsEmirati) : undefined,
      totalSpentManpower: data.totalSpentManpower ? Number(data.totalSpentManpower) : undefined,
      originalEmiratiNumber: data.originalEmiratiNumber ? Number(data.originalEmiratiNumber) : undefined,
      growthEmiratiNumber: data.growthEmiratiNumber ? Number(data.growthEmiratiNumber) : undefined,
      totalStaff: data.totalStaff ? Number(data.totalStaff) : undefined,
      skilledStaff: data.skilledStaff ? Number(data.skilledStaff) : undefined,
      adLogisticsFees: data.adLogisticsFees ? Number(data.adLogisticsFees) : undefined,
      uaeLogisticsFees: data.uaeLogisticsFees ? Number(data.uaeLogisticsFees) : undefined
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof EvaluationFormData] === undefined) {
        delete updateData[key as keyof EvaluationFormData];
      }
    });

    this.evaluationDataService.updateFormData(updateData);
  }

  /**
   * Update productivity form data
   */
  updateProductivityData(data: Partial<ProductivityFormData>): void {
    const updateData: Partial<EvaluationFormData> = {
      totalRevenueMainActivity: data.totalRevenueMainActivity ? Number(data.totalRevenueMainActivity) : undefined,
      finishedGoodsBeginning: data.finishedGoodsBeginning ? Number(data.finishedGoodsBeginning) : undefined,
      finishedGoodsEnd: data.finishedGoodsEnd ? Number(data.finishedGoodsEnd) : undefined,
      workInProgressBeginning: data.workInProgressBeginning ? Number(data.workInProgressBeginning) : undefined,
      workInProgressEnd: data.workInProgressEnd ? Number(data.workInProgressEnd) : undefined,
      otherMiscellaneousIncome: data.otherMiscellaneousIncome ? Number(data.otherMiscellaneousIncome) : undefined,
      rentalsOfBuilding: data.rentalsOfBuilding ? Number(data.rentalsOfBuilding) : undefined,
      averageEmployees: data.averageEmployees ? Number(data.averageEmployees) : undefined,
      totalCostOfProduction: data.totalCostOfProduction ? Number(data.totalCostOfProduction) : undefined,
      wagesSalariesBonusesCogs: data.wagesSalariesBonusesCogs ? Number(data.wagesSalariesBonusesCogs) : undefined,
      benefitsGrantedEmployeesCogs: data.benefitsGrantedEmployeesCogs ? Number(data.benefitsGrantedEmployeesCogs) : undefined,
      depreciationCogs: data.depreciationCogs ? Number(data.depreciationCogs) : undefined,
      totalGeneralAdminExpenses: data.totalGeneralAdminExpenses ? Number(data.totalGeneralAdminExpenses) : undefined,
      wagesSalariesBonusesAdmin: data.wagesSalariesBonusesAdmin ? Number(data.wagesSalariesBonusesAdmin) : undefined,
      benefitsGrantedEmployeesAdmin: data.benefitsGrantedEmployeesAdmin ? Number(data.benefitsGrantedEmployeesAdmin) : undefined,
      depreciationAdmin: data.depreciationAdmin ? Number(data.depreciationAdmin) : undefined,
      bankingCharges: data.bankingCharges ? Number(data.bankingCharges) : undefined
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof EvaluationFormData] === undefined) {
        delete updateData[key as keyof EvaluationFormData];
      }
    });

    this.evaluationDataService.updateFormData(updateData);
  }

  /**
   * Update current step
   */
  updateCurrentStep(step: number): void {
    // Current step tracking is now handled separately or can be added to EvaluationDataService if needed
    console.log('📝 Current step updated:', step);
  }

  /**
   * Get economic impact data
   */
  getEconomicImpactData(): EconomicImpactFormData {
    const data = this.evaluationDataService.getEconomicImpactData();
    return {
      grossBookValueAbuDhabi: data.grossBookValueAbuDhabi?.toString() || '0',
      totalGrossBookValue: data.grossBookValueTotal?.toString() || '0',
      salaryBenefitsEmirati: data.salaryBenefitsEmirati?.toString() || '0',
      totalSpentManpower: data.totalSpentManpower?.toString() || '0',
      originalEmiratiNumber: data.originalEmiratiNumber?.toString() || '0',
      growthEmiratiNumber: data.growthEmiratiNumber?.toString() || '0',
      totalStaff: data.totalStaff?.toString() || '0',
      skilledStaff: data.skilledStaff?.toString() || '0',
      adLogisticsFees: data.adLogisticsFees?.toString() || '0',
      uaeLogisticsFees: data.uaeLogisticsFees?.toString() || '0'
    };
  }

  /**
   * Get productivity data
   */
  getProductivityData(): ProductivityFormData {
    const data = this.evaluationDataService.getProductivityData();
    return {
      totalRevenueMainActivity: data.totalRevenueMainActivity?.toString() || '0',
      finishedGoodsBeginning: data.finishedGoodsBeginning?.toString() || '0',
      finishedGoodsEnd: data.finishedGoodsEnd?.toString() || '0',
      workInProgressBeginning: data.workInProgressBeginning?.toString() || '0',
      workInProgressEnd: data.workInProgressEnd?.toString() || '0',
      otherMiscellaneousIncome: data.otherMiscellaneousIncome?.toString() || '0',
      rentalsOfBuilding: data.rentalsOfBuilding?.toString() || '0',
      averageEmployees: data.averageEmployees?.toString() || '108',
      totalCostOfProduction: data.totalCostOfProduction?.toString() || '0',
      wagesSalariesBonusesCogs: data.wagesSalariesBonusesCogs?.toString() || '0',
      benefitsGrantedEmployeesCogs: data.benefitsGrantedEmployeesCogs?.toString() || '0',
      depreciationCogs: data.depreciationCogs?.toString() || '0',
      totalGeneralAdminExpenses: data.totalGeneralAdminExpenses?.toString() || '0',
      wagesSalariesBonusesAdmin: data.wagesSalariesBonusesAdmin?.toString() || '0',
      benefitsGrantedEmployeesAdmin: data.benefitsGrantedEmployeesAdmin?.toString() || '0',
      depreciationAdmin: data.depreciationAdmin?.toString() || '0',
      bankingCharges: data.bankingCharges?.toString() || '0'
    };
  }

  /**
   * Clear all form data
   */
  clearFormData(): void {
    this.evaluationDataService.resetFormData();
  }

  /**
   * Reset specific form section
   */
  resetEconomicImpactData(): void {
    this.updateEconomicImpactData(this.defaultEconomicImpactData);
  }

  resetProductivityData(): void {
    this.updateProductivityData(this.defaultProductivityData);
  }

  /**
   * Check if form has unsaved changes
   */
  hasUnsavedChanges(): boolean {
    return this.evaluationDataService.hasUnsavedChanges();
  }

  /**
   * Export form data as JSON
   */
  exportFormData(): string {
    const currentState = this.evaluationDataService.exportCurrentState();
    return JSON.stringify(currentState, null, 2);
  }

  /**
   * Import form data from JSON
   */
  importFormData(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData);
      if (imported.formData) {
        // Map and update the data through the centralized service
        this.evaluationDataService.updateFormData(imported.formData);
        return true;
      }
    } catch (error) {
      console.error('❌ Failed to import form data:', error);
    }
    return false;
  }

  /**
   * Map EvaluationFormData to EvaluationFormState
   */
  private mapToFormState(data: EvaluationFormData): EvaluationFormState {
    return {
      economicImpact: {
        grossBookValueAbuDhabi: data.grossBookValueAbuDhabi?.toString() || '0',
        totalGrossBookValue: data.grossBookValueTotal?.toString() || '0',
        salaryBenefitsEmirati: data.salaryBenefitsEmirati?.toString() || '0',
        totalSpentManpower: data.totalSpentManpower?.toString() || '0',
        originalEmiratiNumber: data.originalEmiratiNumber?.toString() || '0',
        growthEmiratiNumber: data.growthEmiratiNumber?.toString() || '0',
        totalStaff: data.totalStaff?.toString() || '0',
        skilledStaff: data.skilledStaff?.toString() || '0',
        adLogisticsFees: data.adLogisticsFees?.toString() || '0',
        uaeLogisticsFees: data.uaeLogisticsFees?.toString() || '0'
      },
      productivity: {
        totalRevenueMainActivity: data.totalRevenueMainActivity?.toString() || '0',
        finishedGoodsBeginning: data.finishedGoodsBeginning?.toString() || '0',
        finishedGoodsEnd: data.finishedGoodsEnd?.toString() || '0',
        workInProgressBeginning: data.workInProgressBeginning?.toString() || '0',
        workInProgressEnd: data.workInProgressEnd?.toString() || '0',
        otherMiscellaneousIncome: data.otherMiscellaneousIncome?.toString() || '0',
        rentalsOfBuilding: data.rentalsOfBuilding?.toString() || '0',
        averageEmployees: data.averageEmployees?.toString() || '108',
        totalCostOfProduction: data.totalCostOfProduction?.toString() || '0',
        wagesSalariesBonusesCogs: data.wagesSalariesBonusesCogs?.toString() || '0',
        benefitsGrantedEmployeesCogs: data.benefitsGrantedEmployeesCogs?.toString() || '0',
        depreciationCogs: data.depreciationCogs?.toString() || '0',
        totalGeneralAdminExpenses: data.totalGeneralAdminExpenses?.toString() || '0',
        wagesSalariesBonusesAdmin: data.wagesSalariesBonusesAdmin?.toString() || '0',
        benefitsGrantedEmployeesAdmin: data.benefitsGrantedEmployeesAdmin?.toString() || '0',
        depreciationAdmin: data.depreciationAdmin?.toString() || '0',
        bankingCharges: data.bankingCharges?.toString() || '0'
      },
      lastUpdated: new Date(),
      currentStep: 0
    };
  }
}