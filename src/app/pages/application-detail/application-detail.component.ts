import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TabNavigationComponent } from '../../components/ui/tab-navigation/tab-navigation.component';
import { IconComponent } from '../../components/ui/icon/icon.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { BreadcrumbsComponent, Breadcrumb } from '../../components/ui/breadcrumbs/breadcrumbs.component';
import { ApplicationStatusService, Application } from '../../services/application-status.service';
import { SidebarComponent } from '../../components/ui/sidebar/sidebar.component';
import { SummaryWidgetComponent, SummaryData } from '../../components/ui/sidebar/widgets/summary-widget/summary-widget.component';
import { ApplicantContactWidgetComponent, ContactData } from '../../components/ui/sidebar/widgets/applicant-contact-widget/applicant-contact-widget.component';
import { SLAComplianceWidgetComponent, SLAData } from '../../components/ui/sidebar/widgets/sla-compliance-widget/sla-compliance-widget.component';

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
    BreadcrumbsComponent,
    SidebarComponent,
    SummaryWidgetComponent,
    ApplicantContactWidgetComponent,
    SLAComplianceWidgetComponent
  ],
  templateUrl: './application-detail.component.html',
  styleUrl: './application-detail.component.scss'
})
export class ApplicationDetailComponent implements OnInit {
  applicationId: string = '';
  application: Application | null = null;
  currentStage: string = 'Application';
  currentStep: number = 0;

  stages: ApplicationStage[] = [
    {
      id: 'Application',
      name: 'Application',
      icon: 'file-text',
      status: 'active',
      steps: [] // No sub-steps
    },
    {
      id: 'RFQ',
      name: 'RFQ',
      icon: 'send',
      status: 'pending',
      steps: [] // No sub-steps
    },
    {
      id: 'Evaluation',
      name: 'Evaluation',
      icon: 'clipboard-check',
      status: 'pending',
      steps: [
        { id: 'general', name: 'General', description: 'General information and requirements', status: 'pending', required: true },
        { id: 'economic-impact', name: 'Economic Impact', description: 'Economic impact assessment', status: 'pending', required: true },
        { id: 'productivity', name: 'Productivity', description: 'Productivity analysis', status: 'pending', required: true },
        { id: 'ems-dms', name: 'EMS/DMS', description: 'Environmental and Data Management Systems', status: 'pending', required: true },
        { id: 'summary', name: 'Summary', description: 'Application summary and overview', status: 'pending', required: true },
        { id: 'review-submit', name: 'Review & Submit', description: 'Final review and submission', status: 'pending', required: true }
      ]
    },
    {
      id: 'Review',
      name: 'Review',
      icon: 'eye',
      status: 'pending',
      steps: [] // No sub-steps
    },
    {
      id: 'Closed',
      name: 'Closed',
      icon: 'check-circle',
      status: 'pending',
      steps: [] // No sub-steps - single final state
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public applicationStatusService: ApplicationStatusService
  ) {}

  ngOnInit() {
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
  }

  loadApplication() {
    // In real implementation, this would fetch from API
    this.application = {
      id: this.applicationId,
      companyName: 'Al Dhafra Manufacturing',
      stage: 'RFQ' as any,
      status: 'Pending' as any,
      progress: 25,
      date: '1 Jan 2025',
      deadline: '1/20/2025',
      category: 'Electricity,Gas',
      assignee: 'Certifying Body',
      contactName: 'Sarah Al Mansoori',
      contactPosition: 'Operations Manager',
      contactEmail: 'sarah@adnoc.com',
      contactPhone: '+971 50 987 6543'
    };
    
    // Application loaded - no need to update stage name anymore
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
      clickable: step.status === 'completed' || step.status === 'active'
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

  get breadcrumbs() {
    return [
      { label: 'Applications', link: '/applications' },
      { label: this.application?.id || 'Application Detail' }
    ];
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
    // Can access current step or any step before it
    return stepIndex <= this.currentStep;
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
      // Completed step - black instead of green
      return 'text-black font-medium hover:text-gray-800';
    } else if (stepIndex === this.currentStep) {
      // Active step
      return 'text-primary font-semibold';
    } else {
      // Locked step - more visible in container
      return 'text-gray-600';
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

  get summaryData(): SummaryData {
    return {
      applicationId: this.application?.id || 'ESP-002',
      applicationDate: '7/20/2025',
      company: this.application?.companyName || 'ADNOC Refining',
      type: 'Renewal',
      services: this.application?.category?.split(',') || ['Electricity', 'Gas'],
      deadline: '9/20/2025',
      assignedTo: this.application?.assignee || 'CB',
      progress: this.application?.progress || 45,
      currentStep: 'Technical Review',
      status: 'Evaluation - In Progress',
      statusVariant: 'warning'
    };
  }

  get contactData(): ContactData {
    return {
      name: this.application?.contactName || 'Sarah Al Mansoori',
      position: this.application?.contactPosition || 'Operations Manager',
      email: this.application?.contactEmail || 'sarah@adnoc.com',
      phone: this.application?.contactPhone || '+971 50 987 6543'
    };
  }

  get slaData(): SLAData {
    const daysLeft = this.getSLADaysLeft();
    let status: 'warning' | 'danger' | 'normal' = 'normal';
    let message = 'Application is within SLA requirements.';

    if (daysLeft <= 3) {
      status = 'danger';
      message = 'This application is overdue. Please prioritize immediately.';
    } else if (daysLeft <= 7) {
      status = 'warning';
      message = 'This application is due soon. Please prioritize.';
    }

    return {
      daysLeft,
      status,
      message
    };
  }
}