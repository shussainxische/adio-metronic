import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  private readonly STORAGE_KEY = 'evaluation_form_state';
  
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

  // BehaviorSubject to track form state changes
  private formState$ = new BehaviorSubject<EvaluationFormState>(this.getStoredFormState());

  constructor() {
    // Initialize with stored data if available
    this.loadFormState();
  }

  /**
   * Get current form state as observable
   */
  getFormState() {
    return this.formState$.asObservable();
  }

  /**
   * Get current form state value
   */
  getCurrentFormState(): EvaluationFormState {
    return this.formState$.value;
  }

  /**
   * Update economic impact form data
   */
  updateEconomicImpactData(data: Partial<EconomicImpactFormData>): void {
    const currentState = this.getCurrentFormState();
    const updatedState: EvaluationFormState = {
      ...currentState,
      economicImpact: {
        ...currentState.economicImpact,
        ...data
      },
      lastUpdated: new Date()
    };

    this.updateFormState(updatedState);
  }

  /**
   * Update productivity form data
   */
  updateProductivityData(data: Partial<ProductivityFormData>): void {
    const currentState = this.getCurrentFormState();
    const updatedState: EvaluationFormState = {
      ...currentState,
      productivity: {
        ...currentState.productivity,
        ...data
      },
      lastUpdated: new Date()
    };

    this.updateFormState(updatedState);
  }

  /**
   * Update current step
   */
  updateCurrentStep(step: number): void {
    const currentState = this.getCurrentFormState();
    const updatedState: EvaluationFormState = {
      ...currentState,
      currentStep: step,
      lastUpdated: new Date()
    };

    this.updateFormState(updatedState);
  }

  /**
   * Get economic impact data
   */
  getEconomicImpactData(): EconomicImpactFormData {
    return this.getCurrentFormState().economicImpact;
  }

  /**
   * Get productivity data
   */
  getProductivityData(): ProductivityFormData {
    return this.getCurrentFormState().productivity;
  }

  /**
   * Clear all form data
   */
  clearFormData(): void {
    this.updateFormState(this.defaultFormState);
    this.removeStoredFormState();
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
    const currentState = this.getCurrentFormState();
    const storedState = this.getStoredFormState();
    
    return JSON.stringify(currentState) !== JSON.stringify(storedState);
  }

  /**
   * Save current form state to localStorage
   */
  saveFormState(): void {
    const currentState = this.getCurrentFormState();
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentState));
      console.log('✅ Form state saved to localStorage');
    } catch (error) {
      console.warn('⚠️ Failed to save form state to localStorage:', error);
    }
  }

  /**
   * Load form state from localStorage
   */
  private loadFormState(): void {
    const stored = this.getStoredFormState();
    if (stored) {
      this.formState$.next(stored);
    }
  }

  /**
   * Get stored form state from localStorage
   */
  private getStoredFormState(): EvaluationFormState {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure all required properties exist (backward compatibility)
        return {
          ...this.defaultFormState,
          ...parsed,
          economicImpact: { ...this.defaultEconomicImpactData, ...parsed.economicImpact },
          productivity: { ...this.defaultProductivityData, ...parsed.productivity }
        };
      }
    } catch (error) {
      console.warn('⚠️ Failed to load form state from localStorage:', error);
    }
    return this.defaultFormState;
  }

  /**
   * Update form state and persist to storage
   */
  private updateFormState(state: EvaluationFormState): void {
    this.formState$.next(state);
    this.saveFormState();
  }

  /**
   * Remove stored form state from localStorage
   */
  private removeStoredFormState(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('⚠️ Failed to remove form state from localStorage:', error);
    }
  }

  /**
   * Auto-save functionality - call this method periodically
   */
  enableAutoSave(intervalMs: number = 30000): void {
    setInterval(() => {
      if (this.hasUnsavedChanges()) {
        this.saveFormState();
      }
    }, intervalMs);
  }

  /**
   * Export form data as JSON
   */
  exportFormData(): string {
    const currentState = this.getCurrentFormState();
    return JSON.stringify(currentState, null, 2);
  }

  /**
   * Import form data from JSON
   */
  importFormData(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData) as EvaluationFormState;
      // Validate the structure
      if (imported.economicImpact && imported.productivity) {
        this.updateFormState(imported);
        return true;
      }
    } catch (error) {
      console.error('❌ Failed to import form data:', error);
    }
    return false;
  }
}