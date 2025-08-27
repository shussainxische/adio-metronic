import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../../components/ui/input/input.component';
import { InputCalculatedComponent } from '../../../../../../components/ui/input-calculated/input-calculated.component';

@Component({
  selector: 'app-productivity-sub-stage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, InputCalculatedComponent],
  templateUrl: './productivity-sub-stage.component.html',
  styleUrl: './productivity-sub-stage.component.scss'
})
export class ProductivitySubStageComponent {
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
        placeholder: '5,000,000'
      },
      finishedGoodsBeginning: {
        label: 'Finished Goods (Beginning of Year)',
        placeholder: '300,000'
      },
      finishedGoodsEnd: {
        label: 'Finished Goods (End of Year)',
        placeholder: '400,000'
      },
      workInProgressBeginning: {
        label: 'Work in Process (Beginning of Year)',
        placeholder: '200,000'
      },
      workInProgressEnd: {
        label: 'Work in Process (End of Year)',
        placeholder: '250,000'
      },
      otherMiscellaneousIncome: {
        label: 'Other Miscellaneous Income',
        placeholder: '50,000'
      },
      rentalsOfBuilding: {
        label: 'Rentals of Building',
        placeholder: '150,000'
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
        placeholder: '2,000,000'
      },
      wagesSalariesBonusesCogs: {
        label: 'Wages, Salaries & Bonuses (in Cash)',
        placeholder: '500,000'
      },
      benefitsGrantedEmployeesCogs: {
        label: 'Benefits Granted to Employees',
        placeholder: '100,000'
      },
      depreciationCogs: {
        label: 'Depreciation',
        placeholder: '150,000'
      },
      totalGeneralAdminExpenses: {
        label: 'Total General & Administrative Expenses',
        placeholder: '1,200,000'
      },
      wagesSalariesBonusesAdmin: {
        label: 'Wages, Salaries & Bonuses (in Cash)',
        placeholder: '300,000'
      },
      benefitsGrantedEmployeesAdmin: {
        label: 'Benefits Granted to Employees',
        placeholder: '80,000'
      },
      depreciationAdmin: {
        label: 'Depreciation',
        placeholder: '120,000'
      },
      bankingCharges: {
        label: 'Banking Charges',
        placeholder: '50,000'
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
        placeholder: '108'
      }
    }
  };

  scoreSummaryData = {
    title: 'Productivity Score Summary',
    staticValues: {
      valueAdded: {
        label: 'Value Added',
        value: '10,000,000 AED'
      },
      averageEmployees: {
        label: 'Average Employees',
        value: '108'
      },
      productivityPerEmployee: {
        label: 'Productivity (per employee)',
        value: '92,593 AED'
      }
    },
    benchmarkInfo: {
      industryBenchmark: 'Industry Benchmark: 1.14x above Food & Beverage industry average',
      yearOverYear: 'Year-over-Year: +14.1% improvement from last year (52,000 AED)'
    }
  };

  get mainRevenue(): number {
    const mainActivity = parseFloat(this.totalRevenueMainActivityControl.value || '0');
    const finishedBegin = parseFloat(this.finishedGoodsBeginningControl.value || '0');
    const finishedEnd = parseFloat(this.finishedGoodsEndControl.value || '0');
    const wipBegin = parseFloat(this.workInProgressBeginningControl.value || '0');
    const wipEnd = parseFloat(this.workInProgressEndControl.value || '0');
    
    return mainActivity + (finishedEnd - finishedBegin) + (wipEnd - wipBegin);
  }

  get secondaryRevenue(): number {
    const otherIncome = parseFloat(this.otherMiscellaneousIncomeControl.value || '0');
    const rentals = parseFloat(this.rentalsOfBuildingControl.value || '0');
    
    return otherIncome + rentals;
  }

  get totalRevenue(): number {
    return this.mainRevenue + this.secondaryRevenue;
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
    
    return totalCostProduction + wagesCogs + benefitsCogs + depreciationCogs +
           totalAdminExpenses + wagesAdmin + benefitsAdmin + depreciationAdmin + bankingCharges;
  }

  get valueAdded(): number {
    return this.totalRevenue - this.totalIntermediateConsumption;
  }

  get productivityScore(): number {
    return 92.5;
  }
}