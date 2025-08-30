import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TabNavigationComponent } from '../../components/ui/tab-navigation/tab-navigation.component';
import { IconComponent } from '../../components/ui/icon/icon.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { ApplicationStatusService, Application } from '../../services/application-status.service';
import { BaseRfqApplicationService, RfqApplicationData, RfqApplicationResponse } from '../../services/base-rfq-application.service';
import { BaseApplicationsSummaryService, ApplicationSummaryItem } from '../../services/base-applications-summary.service';
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
  stageTabs: any[] = [];
  private applicationDetailData: any = null;
  private quotationData: RfqApplicationData | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    public applicationStatusService: ApplicationStatusService,
    private rfqApplicationService: BaseRfqApplicationService,
    private applicationsSummaryService: BaseApplicationsSummaryService
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
          // Default stage logic - will be overridden once application loads with proper stage
          if (this.applicationId === 'ESP003') {
            this.currentStage = 'Quotation';
          } else if (this.applicationId === 'ESP007' || this.applicationId === 'ESP008' || this.applicationId === 'ESP009' || this.applicationId === 'ESP010' || this.applicationId === 'ESP011' || this.applicationId === 'ESP012') {
            this.currentStage = 'Evaluation';
          } else if (this.applicationId === 'ESP013' || this.applicationId === 'ESP014') {
            this.currentStage = 'Review';
          } else {
            this.currentStage = 'Application';
          }
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
      // Basic stages data - this should be replaced with proper service call if needed
      this.stages = [
        {
          id: 'Application',
          name: 'Application',
          icon: 'document',
          status: 'completed' as any,
          steps: []
        },
        {
          id: 'Quotation',
          name: 'Quotation',
          icon: 'calculator',
          status: 'active' as any,
          steps: []
        },
        {
          id: 'Evaluation',
          name: 'Evaluation',
          icon: 'chart',
          status: 'pending' as any,
          steps: [
            {
              id: 'general',
              name: 'General',
              description: 'General evaluation criteria',
              status: 'active' as any,
              required: true
            },
            {
              id: 'economic-impact',
              name: 'Economic Impact',
              description: 'Economic impact assessment',
              status: 'pending' as any,
              required: true
            },
            {
              id: 'productivity',
              name: 'Productivity',
              description: 'Productivity evaluation',
              status: 'pending' as any,
              required: true
            },
            {
              id: 'ems-dms',
              name: 'EMS/DMS',
              description: 'Environmental & Data Management Systems',
              status: 'pending' as any,
              required: true
            },
            {
              id: 'summary',
              name: 'Summary',
              description: 'Evaluation summary',
              status: 'pending' as any,
              required: true
            },
            {
              id: 'review-submit',
              name: 'Review & Submit',
              description: 'Review and submit evaluation',
              status: 'pending' as any,
              required: true
            }
          ]
        },
        {
          id: 'Review',
          name: 'Review',
          icon: 'eye',
          status: 'pending' as any,
          steps: []
        },
        {
          id: 'Completed',
          name: 'Completed',
          icon: 'check-circle',
          status: 'pending' as any,
          steps: []
        }
      ];
      this.updateStageTabs();
      resolve();
    });
  }

  loadApplication() {
    const appId = parseInt(this.applicationId, 10);
   
    if (isNaN(appId)) {
      console.error('Invalid application ID:', this.applicationId);
      this.loadFallbackApplication();
      return;
    }
 
    // First get summary data to determine which service to use based on stage
    this.applicationsSummaryService.getApplicationSummaryById(appId).subscribe({
      next: (summaryItem) => {
        if (summaryItem) {
          const stage = summaryItem.wfStgName.toLowerCase();
          
          if (stage === 'rfq') {
            // For RFQ stage, use the RFQ service
            this.loadRfqApplication(appId, summaryItem);
          } else {
            // For other stages (Evaluation, Review, Close), create application from summary data only
            this.application = {
              id: summaryItem.appReferenceNumber,
              appId: summaryItem.appId,
              companyName: summaryItem.invCompanyName,
              stage: this.mapStageFromSummary(summaryItem.wfStgName),
              status: this.mapStatusFromSummary(summaryItem.wfSubstgName),
              progress: summaryItem.wfSubstgProgress,
              date: new Date().toLocaleDateString(),
              assignee: 'Certifying Body'
            };
            
            // Set default stage based on application status
            this.setDefaultStageForApplication(summaryItem);
            
            this.updateStageTabs();
            this.cdr.detectChanges();
          }
        } else {
          console.error('Application not found in summary service');
          this.loadFallbackApplication();
        }
      },
      error: (error) => {
        console.error('Error loading application summary:', error);
        this.loadFallbackApplication();
      }
    });
  }
  
  private loadRfqApplication(appId: number, summaryItem: any) {
    // Load RFQ application data for applications in RFQ stage
    this.rfqApplicationService.getRfqApplication(appId).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.quotationData = response.data;
          this.applicationDetailData = null; // No longer needed
          this.application = this.createApplicationFromQuotationData(response.data, summaryItem);
          
          // Set default stage based on RFQ substage
          this.setDefaultStageForApplication(summaryItem);
          
          this.updateStageTabs();
          this.cdr.detectChanges();
        } else {
          console.error('RFQ API returned unsuccessful response:', response.errors);
          // Even if RFQ service fails, we can still show basic info from summary
          this.application = {
            id: summaryItem.appReferenceNumber,
            appId: summaryItem.appId,
            companyName: summaryItem.invCompanyName,
            stage: this.mapStageFromSummary(summaryItem.wfStgName),
            status: this.mapStatusFromSummary(summaryItem.wfSubstgName),
            progress: summaryItem.wfSubstgProgress,
            date: new Date().toLocaleDateString(),
            assignee: 'Certifying Body'
          };
          
          // Set default stage based on RFQ substage
          this.setDefaultStageForApplication(summaryItem);
          
          this.updateStageTabs();
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading RFQ application:', error);
        // Even if RFQ service fails, we can still show basic info from summary
        this.application = {
          id: summaryItem.appReferenceNumber,
          appId: summaryItem.appId,
          companyName: summaryItem.invCompanyName,
          stage: this.mapStageFromSummary(summaryItem.wfStgName),
          status: this.mapStatusFromSummary(summaryItem.wfSubstgName),
          progress: summaryItem.wfSubstgProgress,
          date: new Date().toLocaleDateString(),
          assignee: 'Certifying Body'
        };
        
        // Set default stage based on RFQ substage
        this.setDefaultStageForApplication(summaryItem);
        
        this.updateStageTabs();
        this.cdr.detectChanges();
      }
    });
  }
 
  private createApplicationFromQuotationData(data: RfqApplicationData, summaryItem?: ApplicationSummaryItem): Application {
    const licenseDetails = data.licenseDetails;
    const companyContact = data.companyContact;
   
    return {
      id: summaryItem ? summaryItem.appReferenceNumber : this.applicationId,
      appId: summaryItem ? summaryItem.appId : parseInt(this.applicationId, 10),
      companyName: licenseDetails.invCompanyName,
      stage: summaryItem ? this.mapStageFromSummary(summaryItem.wfStgName) : 'RFQ',
      status: summaryItem ? this.mapStatusFromSummary(summaryItem.wfSubstgName) : this.determineStatusFromActivityLog(data.activityLog),
      progress: summaryItem ? summaryItem.wfSubstgProgress : this.calculateProgressFromActivityLog(data.activityLog),
      date: this.formatDate(licenseDetails.invLicenseIssueDate),
      deadline: this.formatDate(licenseDetails.invLicenseExpiryDate),
      category: this.determineCategoryFromLicense(licenseDetails),
      assignee: this.determineCurrentAssignee(data.activityLog),
      contactName: companyContact.invFullName,
      contactPosition: companyContact.invPosition,
      contactEmail: companyContact.invEmail,
      contactPhone: companyContact.invPhone
    };
  }
 
  private loadMockApplication() {
    this.http.get<{applicationStages: ApplicationStage[], applications: any[]}>('assets/mock-data/applications.json')
      .subscribe({
        next: (data) => {
          const applicationData = data.applications.find(app => app.id === this.applicationId);
          if (applicationData) {
            this.applicationDetailData = applicationData;
            this.application = {
              id: applicationData.id,
              companyName: applicationData.companyName,
              companyType: applicationData.companyType,
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
            this.updateStageTabs();
          } else {
            // Fallback for unknown application ID
            console.warn(`Application ${this.applicationId} not found in mock data`);
            this.applicationDetailData = null;
            this.application = {
              id: this.applicationId,
              companyName: 'Unknown Company',
              stage: 'Quotation' as any,
              status: 'Pending' as any,
              progress: 0,
              date: new Date().toLocaleDateString(),
              assignee: 'Certifying Body'
            };
            this.updateStageTabs();
          }
        },
        error: (error) => {
          console.error('Error loading mock application data:', error);
          this.loadFallbackApplication();
        }
      });
  }
 
  private loadFallbackApplication() {
    console.warn(`Application ${this.applicationId} not found in RFQ service, trying summary service for basic data`);
    this.applicationDetailData = null;
    
    const appId = parseInt(this.applicationId, 10);
    
    // Try to get summary data to at least get the correct reference number and basic info
    this.applicationsSummaryService.getApplicationSummaryById(appId).subscribe({
      next: (summaryItem) => {
        if (summaryItem) {
          this.application = {
            id: summaryItem.appReferenceNumber,
            appId: summaryItem.appId,
            companyName: summaryItem.invCompanyName,
            stage: this.mapStageFromSummary(summaryItem.wfStgName),
            status: this.mapStatusFromSummary(summaryItem.wfSubstgName),
            progress: summaryItem.wfSubstgProgress,
            date: new Date().toLocaleDateString(),
            assignee: 'Certifying Body'
          };
        } else {
          // Final fallback if nothing is found
          this.application = {
            id: this.applicationId,
            companyName: 'Unknown Company',
            stage: 'Quotation' as any,
            status: 'Pending' as any,
            progress: 0,
            date: new Date().toLocaleDateString(),
            assignee: 'Certifying Body'
          };
        }
        this.updateStageTabs();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading summary data for fallback:', error);
        // Final fallback if summary service also fails
        this.application = {
          id: this.applicationId,
          companyName: 'Unknown Company',
          stage: 'Quotation' as any,
          status: 'Pending' as any,
          progress: 0,
          date: new Date().toLocaleDateString(),
          assignee: 'Certifying Body'
        };
        this.updateStageTabs();
        this.cdr.detectChanges();
      }
    });
  }
 
  private calculateProgressFromActivityLog(activityLog: any[]): number {
    // Simple progress calculation based on activity log entries
    // You can implement more sophisticated logic based on your business rules
    if (!activityLog || activityLog.length === 0) return 0;
   
    const totalSteps = 10; // Assume 10 steps in the process
    const completedSteps = Math.min(activityLog.length, totalSteps);
    return Math.round((completedSteps / totalSteps) * 100);
  }
 
  private determineCategoryFromLicense(licenseDetails: any): string {
    // Determine category based on license details - you can customize this logic
    const industrialType = licenseDetails.invIndustrialType?.toLowerCase() || '';
   
    if (industrialType.includes('manufacturing')) {
      return 'Electricity, Gas';
    } else if (industrialType.includes('chemical')) {
      return 'Gas';
    }
   
    return 'Electricity';
  }
 
  private determineCurrentAssignee(activityLog: any[]): string {
    // Determine current assignee from activity log
    if (!activityLog || activityLog.length === 0) return 'ADIO';
   
    const latestEntry = activityLog[activityLog.length - 1];
    return latestEntry.userName || 'ADIO';
  }

  get currentStageData() {
    return this.stages.find(stage => stage.id === this.currentStage);
  }

  get currentStepData() {
    const stage = this.currentStageData;
    return stage?.steps[this.currentStep] || null;
  }

  private setDefaultStageForApplication(summaryItem: any) {
    // Only set default stage if no stage parameter is provided in URL
    this.route.queryParams.subscribe(params => {
      if (!params['stage']) {
        const stage = summaryItem.wfStgName?.toLowerCase();
        const substage = summaryItem.wfSubstgName?.toLowerCase();
        
        if (stage === 'rfq') {
          // If RFQ substage is 'Submitted', default to 'Quotation' tab
          if (substage === 'submitted') {
            this.currentStage = 'Quotation';
          } else {
            // For other RFQ substages (like 'Pending'), default to 'Application' tab
            this.currentStage = 'Application';
          }
        } else if (stage === 'evaluation') {
          this.currentStage = 'Evaluation';
        } else if (stage === 'review') {
          this.currentStage = 'Review';
        } else if (stage === 'close' || stage === 'closed') {
          this.currentStage = 'Completed';
        } else {
          // Default fallback
          this.currentStage = 'Application';
        }
        
        this.updateUrl();
      }
    }).unsubscribe(); // Unsubscribe immediately since this is a one-time check
  }

  private updateStageTabs() {
    console.log('updateStageTabs called with application:', this.application);
    console.log('Application stage:', this.application?.stage);
    
    // For Closed applications with Certified status, only show Completed tab
    if (this.application?.stage === 'Closed' && this.application?.status === 'Certified') {
      this.stageTabs = this.stages.filter(stage => 
        stage.id === 'Completed'
      ).map(stage => ({ 
        id: stage.id, 
        label: stage.name,
        icon: stage.icon
      }));
      return;
    }
    
    // For RFQ stage applications (with Pending/Submitted substages), only show Application and Quotation tabs  
    if (this.application?.stage === 'RFQ') {
      console.log('RFQ stage detected - showing only Application and Quotation tabs');
      this.stageTabs = this.stages.filter(stage => 
        stage.id === 'Application' || stage.id === 'Quotation'
      ).map(stage => ({ 
        id: stage.id, 
        label: stage.name,
        icon: stage.icon
      }));
      console.log('stageTabs after RFQ filter:', this.stageTabs);
      return;
    }

    // For Quotation stage applications, only show Application and Quotation tabs  
    if (this.application?.stage === 'Quotation') {
      this.stageTabs = this.stages.filter(stage => 
        stage.id === 'Application' || stage.id === 'Quotation'
      ).map(stage => ({ 
        id: stage.id, 
        label: stage.name,
        icon: stage.icon
      }));
      return;
    }
    
    // For Evaluation stage applications, show Application, Quotation, and Evaluation tabs
    if (this.application?.stage === 'Evaluation') {
      console.log('Evaluation stage detected - showing Application, Quotation, and Evaluation tabs');
      this.stageTabs = this.stages.filter(stage => 
        stage.id === 'Application' || stage.id === 'Quotation' || stage.id === 'Evaluation'
      ).map(stage => ({ 
        id: stage.id, 
        label: stage.name,
        icon: stage.icon
      }));
      console.log('stageTabs after Evaluation filter:', this.stageTabs);
      return;
    }
    
    // For Review stage applications, hide Completed tab
    if (this.application?.stage === 'Review') {
      this.stageTabs = this.stages.filter(stage => 
        stage.id !== 'Completed'
      ).map(stage => ({ 
        id: stage.id, 
        label: stage.name,
        icon: stage.icon
      }));
      return;
    }
    
    // For other stages, show all tabs
    this.stageTabs = this.stages.map(stage => ({ 
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

  isSLAViolation(): boolean {
    if (!this.application?.deadline) return false;
    const today = new Date();
    const deadlineDate = new Date(this.application.deadline);
    return today > deadlineDate && this.application.stage !== 'Closed';
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
    const baseRows: any[] = [
      { label: 'Status', value: this.applicationStatusService.getBadgeText(this.application?.stage || 'Quotation', this.application?.status || 'Pending'), type: 'status-badge', statusVariant: this.applicationStatusService.getStatusVariant(this.application?.status || 'Pending') },
      { label: 'Application ID', value: this.application?.id || 'ESP-001' },
      { label: 'Application Date', value: this.getApplicationDate() },
      { label: 'Company', value: this.application?.companyName || 'Unknown Company' },
      { label: 'Type', value: this.getApplicationType() },
      { label: 'Entity Type', value: this.getEntityType() },
      { label: 'Services', value: this.getServices(), type: 'status-badges', allowWrap: true },
      { label: 'Progress', value: '', type: 'progress', progress: this.application?.progress || 0 }
    ];

    // Add stage-specific rows
    if (this.application?.stage === 'Quotation') {
      // Only add Compliance row for Quotation stage applications
      baseRows.push({ label: 'Compliance', value: this.getCompliance(), type: 'compliance' });
    } else if (this.application?.stage === 'Closed') {
      // Add closed-specific information based on status
      this.addClosedStatusRows(baseRows);
    }

    return {
      title: 'Summary',
      rows: baseRows
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

 

 
  // New methods to access quotation data
  get licenseDetails() {
    return this.quotationData?.licenseDetails || null;
  }
 
  get companyContact() {
    return this.quotationData?.companyContact || null;
  }
 
  get documents() {
    return this.quotationData?.documents || [];
  }
 
  get activityLog() {
    return this.quotationData?.activityLog || [];
  }
 
  // Enhanced getters that use API data when available
  private getApplicationDate(): string {
    if (this.quotationData) {
      return this.formatDate(this.quotationData.licenseDetails.invLicenseIssueDate);
    }
    return this.getApplicationDetail('applicationDate') || this.application?.date || new Date().toLocaleDateString();
  }

  private getApplicationType(): string {
    return this.getApplicationDetail('applicationType') || this.application?.companyType || 'Unknown Type';
  }

  private getEntityType(): string {
    if (this.quotationData) {
      return this.quotationData.licenseDetails.invIndustrialType || 'Manufacturing';
    }
    return this.getApplicationDetail('entityType') || 'Unknown Entity Type';
  }

  private getServices(): string[] {
    if (this.quotationData) {
      // Determine services from license details
      return this.determineCategoryFromLicense(this.quotationData.licenseDetails).split(', ');
    }
   
    const services = this.getApplicationDetail('services');
    if (Array.isArray(services)) {
      return services;
    }
   
    const category = this.application?.category;
    return category ? category.split(',').map(cat => cat.trim()) : ['Unknown Service'];
  }

  private getCompliance(): string {
    if (this.quotationData && this.quotationData.activityLog.length > 0) {
      const latestActivity = this.quotationData.activityLog[this.quotationData.activityLog.length - 1];
      // You can implement logic to determine compliance status from activity log
      return latestActivity.message.includes('approved') ? 'Compliant' : 'Pending Review';
    }
    return this.getApplicationDetail('compliance') || 'Unknown Compliance Status';
  }

  // Utility methods for API data
  getFormattedDocumentSize(sizeMb: number): string {
    return this.formatFileSize(sizeMb);
  }
 
  getFormattedDate(dateString: string): string {
    return this.formatDate(dateString);
  }
 
    getFormattedDateTime(dateString: string): string {
        return this.formatDateTime(dateString);
    }

  // Utility methods moved from service
  private formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  private formatDateTime(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private formatFileSize(sizeMb: number): string {
    if (sizeMb < 1) {
      return `${Math.round(sizeMb * 1024)} KB`;
    }
    return `${sizeMb.toFixed(1)} MB`;
  }
  private getApplicationDetail(key: string): any {
    return this.applicationDetailData ? this.applicationDetailData[key] : null;
  }

  private addClosedStatusRows(rows: any[]) {
    const status = this.application?.status;
    
    switch (status) {
      case 'Certified':
        // Add issue date and expiry date for certified applications
        const issueDate = this.getApplicationDetail('issueDate');
        const expiryDate = this.getApplicationDetail('expiryDate');
        
        if (issueDate) {
          rows.push({ label: 'Issued', value: issueDate });
        }
        if (expiryDate) {
          const isExpired = this.applicationStatusService.isCertificateExpired(this.application!);
          rows.push({ 
            label: isExpired ? 'Expired' : 'Expiring', 
            value: expiryDate,
            type: isExpired ? 'expired-date' : 'text'
          });
        }
        break;
        
      case 'Not Awarded':
        // Add decision date and rejection reason
        const decisionDate = this.application?.date;
        const rejectionReason = this.getApplicationDetail('rejectionReason');
        
        if (decisionDate) {
          rows.push({ label: 'Decision Date', value: decisionDate });
        }
        if (rejectionReason) {
          rows.push({ label: 'Reason', value: rejectionReason, type: 'italic-text' });
        }
        break;
        
      case 'Rejected':
        // Add decision date and rejection reason
        const rejectedDate = this.application?.date;
        const rejectedReason = this.getApplicationDetail('rejectionReason');
        
        if (rejectedDate) {
          rows.push({ label: 'Decision Date', value: rejectedDate });
        }
        if (rejectedReason) {
          rows.push({ label: 'Reason', value: rejectedReason, type: 'italic-text' });
        }
        break;
        
      case 'Cancelled':
        // Add cancellation date and reason
        const cancelledDate = this.application?.date;
        const cancellationReason = this.getApplicationDetail('cancellationReason');
        
        if (cancelledDate) {
          rows.push({ label: 'Cancelled Date', value: cancelledDate });
        }
        if (cancellationReason) {
          rows.push({ label: 'Reason', value: cancellationReason, type: 'italic-text' });
        }
        break;
    }
  }

  private mapStageFromSummary(stage: string): 'RFQ' | 'Quotation' | 'Evaluation' | 'Review' | 'Closed' {
    const stageMap: { [key: string]: 'RFQ' | 'Quotation' | 'Evaluation' | 'Review' | 'Closed' } = {
      'rfq': 'RFQ',
      'quotation': 'Quotation', 
      'evaluation': 'Evaluation',
      'review': 'Review',
      'close': 'Closed',
      'closed': 'Closed'
    };
    return stageMap[stage.toLowerCase()] || 'RFQ';
  }

  private mapStatusFromSummary(substage: string): 'Pending' | 'Submitted' | 'In Progress' | 'Returned' | 'Initial Review' | 'External Review' | 'Final Review' | 'Certified' | 'Not Awarded' | 'Cancelled' | 'Rejected' {
    const statusMap: { [key: string]: 'Pending' | 'Submitted' | 'In Progress' | 'Returned' | 'Initial Review' | 'External Review' | 'Final Review' | 'Certified' | 'Not Awarded' | 'Cancelled' | 'Rejected' } = {
      'pending': 'Pending',
      'submitted': 'Submitted',
      'in progress': 'In Progress',
      'returned': 'Returned',
      'initial review': 'Initial Review',
      'external review': 'External Review',
      'final review': 'Final Review',
      'certified': 'Certified',
      'not awarded': 'Not Awarded',
      'cancelled': 'Cancelled',
      'rejected': 'Rejected'
    };
    return statusMap[substage.toLowerCase()] || 'Pending';
  }

  private determineStatusFromActivityLog(activityLog: any[]): 'Pending' | 'Submitted' | 'In Progress' | 'Returned' | 'Initial Review' | 'External Review' | 'Final Review' | 'Certified' | 'Not Awarded' | 'Cancelled' | 'Rejected' {
    if (!activityLog || activityLog.length === 0) return 'Pending';
    
    const latestEntry = activityLog[activityLog.length - 1];
    const message = latestEntry.message?.toLowerCase() || '';
    
    if (message.includes('submitted')) return 'Submitted';
    if (message.includes('pending')) return 'Pending';
    if (message.includes('in progress')) return 'In Progress';
    if (message.includes('returned')) return 'Returned';
    
    return 'Pending'; // Default fallback
  }

}