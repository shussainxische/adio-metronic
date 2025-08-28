import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TabNavigationComponent } from '../../components/ui/tab-navigation/tab-navigation.component';
import { IconComponent } from '../../components/ui/icon/icon.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { ApplicationStatusService, Application } from '../../services/application-status.service';
import { RightPanelComponent } from './right-panel/right-panel.component';
import { InfoTableData } from '../../components/ui/widgets/info-table-widget/info-table-widget.component';

// Stage Components
import { TammApplicationStageComponent } from './stages/tamm-application/tamm-application-stage.component';
import { RfqStageComponent } from './stages/rfq/rfq-stage.component';
import { EvaluationStageComponent } from './stages/evaluation/evaluation-stage.component';
import { ReviewStageComponent } from './stages/review/review-stage.component';
import { CompletedStageComponent } from './stages/completed/completed-stage.component';

// Evaluation Sub-Stage Components
import { GeneralSubStageComponent } from './stages/evaluation/sub-stages/general/general-sub-stage.component';
import { EconomicImpactSubStageComponent } from './stages/evaluation/sub-stages/economic-impact/economic-impact-sub-stage.component';
import { ProductivitySubStageComponent } from './stages/evaluation/sub-stages/productivity/productivity-sub-stage.component';
import { EmsDmsSubStageComponent } from './stages/evaluation/sub-stages/ems-dms/ems-dms-sub-stage.component';
import { SummarySubStageComponent } from './stages/evaluation/sub-stages/summary/summary-sub-stage.component';
import { ReviewSubmitSubStageComponent } from './stages/evaluation/sub-stages/review-submit/review-submit-sub-stage.component';

interface ApplicationStage {
  id: string;
  name: string;
  icon: string;
  status: 'completed' | 'active' | 'pending';
  steps: ApplicationStep[];
}

interface ApplicationStep {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
  required: boolean;
}

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [
    CommonModule,
    TabNavigationComponent,
    IconComponent,
    ButtonComponent,
    RightPanelComponent,
    // Stage Components
    TammApplicationStageComponent,
    RfqStageComponent,
    EvaluationStageComponent,
    ReviewStageComponent,
    CompletedStageComponent,
    // Evaluation Sub-Stage Components
    GeneralSubStageComponent,
    EconomicImpactSubStageComponent,
    ProductivitySubStageComponent,
    EmsDmsSubStageComponent,
    SummarySubStageComponent,
    ReviewSubmitSubStageComponent
  ],
  templateUrl: './application-detail.component.html',
  styleUrl: './application-detail.component.scss'
})
export class ApplicationDetailComponent implements OnInit {
  applicationId: string = '';
  application: Application | null = null;
  currentStage: string = 'Application';
  currentStep: number = 0;

  stages: ApplicationStage[] = [];
  private applicationDetailData: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    public applicationStatusService: ApplicationStatusService
  ) {}

  ngOnInit() {
    this.loadStagesData().then(() => {
      this.route.params.subscribe(params => {
        this.applicationId = params['id'];
        this.loadApplication();
      });

      this.route.queryParams.subscribe(params => {
        if (params['stage']) {
          this.currentStage = params['stage'];
        } else {
          // Default to Application stage if no query param
          this.currentStage = 'Application';
          this.updateUrl();
        }
        if (params['step']) {
          this.currentStep = parseInt(params['step'], 10);
        } else {
          // Default to first step
          this.currentStep = 0;
        }
      });
    });
  }

  private async loadStagesData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<{applicationStages: ApplicationStage[], applications: any[]}>('assets/mock-data/applications.json')
        .subscribe({
          next: (data) => {
            this.stages = data.applicationStages;
            resolve();
          },
          error: (error) => {
            console.error('Error loading application data:', error);
            // Fallback to empty arrays if loading fails
            this.stages = [];
            reject(error);
          }
        });
    });
  }

  loadApplication() {
    this.http.get<{applicationStages: ApplicationStage[], applications: any[]}>('assets/mock-data/applications.json')
      .subscribe({
        next: (data) => {
          const applicationData = data.applications.find(app => app.id === this.applicationId);
          if (applicationData) {
            this.applicationDetailData = applicationData; // Store the full data
            this.application = {
              id: applicationData.id,
              companyName: applicationData.companyName,
              stage: applicationData.stage as any,
              status: applicationData.status as any,
              progress: applicationData.progress,
              date: applicationData.date,
              deadline: applicationData.deadline,
              category: applicationData.category,
              assignee: applicationData.assignee,
              contactName: applicationData.contactName,
              contactPosition: applicationData.contactPosition,
              contactEmail: applicationData.contactEmail,
              contactPhone: applicationData.contactPhone
            };
          } else {
            // Fallback for unknown application ID
            console.warn(`Application ${this.applicationId} not found in mock data`);
            this.applicationDetailData = null;
            this.application = {
              id: this.applicationId,
              companyName: 'Unknown Company',
              stage: 'RFQ' as any,
              status: 'Pending' as any,
              progress: 0,
              date: new Date().toLocaleDateString(),
              assignee: 'Certifying Body'
            };
          }
        },
        error: (error) => {
          console.error('Error loading application data:', error);
          this.applicationDetailData = null;
          // Fallback application data
          this.application = {
            id: this.applicationId,
            companyName: 'Unknown Company',
            stage: 'RFQ' as any,
            status: 'Pending' as any,
            progress: 0,
            date: new Date().toLocaleDateString(),
            assignee: 'Certifying Body'
          };
        }
      });
  }

  get currentStageData() {
    return this.stages.find(stage => stage.id === this.currentStage);
  }

  get currentStepData() {
    const stage = this.currentStageData;
    return stage?.steps[this.currentStep] || null;
  }

  get stageTabs() {
    return this.stages.map(stage => ({ 
      id: stage.id, 
      label: stage.name,
      icon: stage.icon
    }));
  }

  get currentStageSteps() {
    return this.currentStageData?.steps.map(step => ({ 
      id: step.id,
      label: step.name,
      description: step.description,
      clickable: true // Make all steps clickable for prototype
    })) || [];
  }

  onStageChange(stageId: string) {
    this.currentStage = stageId;
    this.currentStep = 0;
    this.updateUrl();
  }

  onStepChange(stepIndex: number) {
    this.currentStep = stepIndex;
    this.updateUrl();
  }

  nextStep() {
    const stage = this.currentStageData;
    if (stage && this.currentStep < stage.steps.length - 1) {
      this.currentStep++;
      this.updateUrl();
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateUrl();
    }
  }

  nextStage() {
    const currentStageIndex = this.stages.findIndex(stage => stage.id === this.currentStage);
    if (currentStageIndex < this.stages.length - 1) {
      this.currentStage = this.stages[currentStageIndex + 1].id;
      this.currentStep = 0;
      this.updateUrl();
    }
  }

  previousStage() {
    const currentStageIndex = this.stages.findIndex(stage => stage.id === this.currentStage);
    if (currentStageIndex > 0) {
      this.currentStage = this.stages[currentStageIndex - 1].id;
      this.currentStep = 0;
      this.updateUrl();
    }
  }

  private updateUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { stage: this.currentStage, step: this.currentStep },
      queryParamsHandling: 'merge'
    });
  }

  getStageProgress(stage: ApplicationStage): number {
    const completedSteps = stage.steps.filter(step => step.status === 'completed').length;
    return Math.round((completedSteps / stage.steps.length) * 100);
  }

  goBack() {
    this.router.navigate(['/applications']);
  }

  exportActivityLog() {
    // TODO: Implement activity log export functionality
    console.log('Export activity log clicked');
  }

  get showPreviousStageButton(): boolean {
    return this.currentStep === 0 && this.stages.findIndex(s => s.id === this.currentStage) > 0;
  }

  get showNextStageButton(): boolean {
    const currentStageIndex = this.stages.findIndex(s => s.id === this.currentStage);
    return this.currentStep === (this.currentStageData?.steps.length || 0) - 1 && currentStageIndex < this.stages.length - 1;
  }

  get showCompleteButton(): boolean {
    return this.currentStep === (this.currentStageData?.steps.length || 0) - 1 && this.currentStage === 'Closed';
  }

  get showNextStepButton(): boolean {
    const stage = this.currentStageData;
    return stage ? this.currentStep < stage.steps.length - 1 : false;
  }

  get showPreviousStepButton(): boolean {
    return this.currentStep > 0;
  }

  getNextButtonAction() {
    if (this.showCompleteButton) {
      this.completeApplication();
    } else if (this.showNextStepButton) {
      this.nextStep();
    } else if (this.showNextStageButton) {
      this.nextStage();
    }
  }

  getNextButtonText(): string {
    if (this.showCompleteButton) {
      return 'Complete';
    } else if (this.showNextStepButton) {
      return 'Next';
    } else if (this.showNextStageButton) {
      return 'Next Stage';
    }
    return 'Next';
  }

  completeApplication() {
    // TODO: Implement complete application functionality
    console.log('Complete application clicked');
  }



  getSimpleStepClasses(stepIndex: number): string {
    if (stepIndex < this.currentStep) {
      // Completed step
      return 'bg-primary border-primary text-white';
    } else if (stepIndex === this.currentStep) {
      // Active step
      return 'bg-white border-primary text-primary';
    } else {
      // Pending step
      return 'bg-white border-gray-300 text-gray-400';
    }
  }

  getSimpleStepLabelClasses(stepIndex: number): string {
    if (stepIndex < this.currentStep) {
      // Completed step
      return 'text-primary';
    } else if (stepIndex === this.currentStep) {
      // Active step
      return 'text-gray-900';
    } else {
      // Pending step
      return 'text-gray-400';
    }
  }

  getStepDescription(stepIndex: number): string {
    const step = this.currentStageData?.steps[stepIndex];
    return step?.description || '';
  }

  getLeanStepClasses(stepIndex: number): string {
    if (stepIndex < this.currentStep) {
      // Completed step
      return 'bg-primary text-white';
    } else if (stepIndex === this.currentStep) {
      // Active step
      return 'bg-primary text-white';
    } else {
      // Pending step
      return 'bg-gray-200 text-gray-600';
    }
  }

  getLeanStepLabelClasses(stepIndex: number): string {
    if (stepIndex <= this.currentStep) {
      // Completed or active step
      return 'text-primary font-medium';
    } else {
      // Pending step
      return 'text-gray-400';
    }
  }

  get hasMultipleSteps(): boolean {
    return this.currentStageData?.steps.length > 0;
  }

  getChevronStepClasses(stepIndex: number): string {
    if (stepIndex < this.currentStep) {
      // Completed step
      return 'bg-green-50 text-green-700 border border-green-200';
    } else if (stepIndex === this.currentStep) {
      // Active step
      return 'bg-primary text-white';
    } else if (this.canAccessStep(stepIndex)) {
      // Accessible but not current
      return 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100';
    } else {
      // Locked step
      return 'bg-gray-100 text-gray-400 cursor-not-allowed';
    }
  }

  getChevronArrowClasses(stepIndex: number): string {
    if (stepIndex < this.currentStep) {
      // Completed connection
      return 'text-green-500';
    } else {
      // Pending connection
      return 'text-gray-400';
    }
  }

  canAccessStep(stepIndex: number): boolean {
    return true; // All steps are accessible
  }

  onStepClick(stepIndex: number): void {
    if (this.canAccessStep(stepIndex)) {
      this.onStepChange(stepIndex);
    }
  }

  getSimpleTextStepClasses(stepIndex: number): string {
    if (stepIndex < this.currentStep) {
      // Completed step
      return 'text-green-600 font-medium hover:text-green-700';
    } else if (stepIndex === this.currentStep) {
      // Active step
      return 'text-primary font-semibold';
    } else {
      // Locked step
      return 'text-gray-400';
    }
  }

  getContainerStepClasses(stepIndex: number): string {
    if (stepIndex < this.currentStep) {
      // Completed step - black, not bold
      return 'text-black font-normal hover:text-gray-800 cursor-pointer text-sm';
    } else if (stepIndex === this.currentStep) {
      // Active step
      return 'text-primary font-semibold cursor-pointer text-sm';
    } else {
      // Pending step - more visible in container
      return 'text-gray-600 cursor-pointer text-sm';
    }
  }

  getSLADaysLeft(): number {
    // Calculate days left based on deadline
    if (!this.application?.deadline) return 0;
    
    const deadline = new Date(this.application.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }

  get summaryTableData(): InfoTableData {
    return {
      title: 'Summary',
      rows: [
        { label: 'Status', value: this.applicationStatusService.getBadgeText(this.application?.stage || 'RFQ', this.application?.status || 'Pending'), type: 'status-badge', statusVariant: this.applicationStatusService.getStatusVariant(this.application?.status || 'Pending') as any },
        { label: 'Application ID', value: this.application?.id || 'ESP-001' },
        { label: 'Application Date', value: this.getApplicationDate() },
        { label: 'Company', value: this.application?.companyName || 'Unknown Company' },
        { label: 'Type', value: this.getApplicationType() },
        { label: 'Entity Type', value: this.getEntityType() },
        { label: 'Services', value: this.getServices(), type: 'status-badges', allowWrap: true },
        { label: 'Progress', value: '', type: 'progress', progress: this.application?.progress || 0 },
        { label: 'Compliance', value: this.getCompliance(), type: 'compliance' }
      ]
    };
  }

  get contactTableData(): InfoTableData {
    return {
      title: 'Applicant Contact',
      rows: [
        { label: 'Name', value: this.application?.contactName || 'Unknown Contact' },
        { label: 'Position', value: this.application?.contactPosition || 'Unknown Position' },
        { label: 'Email', value: this.application?.contactEmail || 'unknown@company.com' },
        { label: 'Phone', value: this.application?.contactPhone || '+971 50 000 0000' }
      ]
    };
  }

  private getApplicationDate(): string {
    return this.getApplicationDetail('applicationDate') || this.application?.date || new Date().toLocaleDateString();
  }

  private getApplicationType(): string {
    return this.getApplicationDetail('applicationType') || 'Unknown Type';
  }

  private getEntityType(): string {
    return this.getApplicationDetail('entityType') || 'Unknown Entity Type';
  }

  private getServices(): string[] {
    const services = this.getApplicationDetail('services');
    if (Array.isArray(services)) {
      return services;
    }
    // Fallback to category parsing
    const category = this.application?.category;
    return category ? category.split(',').map(cat => cat.trim()) : ['Unknown Service'];
  }

  private getCompliance(): string {
    return this.getApplicationDetail('compliance') || 'Unknown Compliance Status';
  }

  private getApplicationDetail(key: string): any {
    return this.applicationDetailData ? this.applicationDetailData[key] : null;
  }

}