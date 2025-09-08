import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IconComponent } from '../../../../components/ui/icon/icon.component';
import { StatusBadgeComponent, StatusBadgeVariant } from '../../../../components/ui/status-badge/status-badge.component';
import { GeneralSubStageComponent } from '../evaluation/sub-stages/general/general-sub-stage.component';
import { EconomicImpactSubStageComponent } from '../evaluation/sub-stages/economic-impact/economic-impact-sub-stage.component';
import { ProductivitySubStageComponent } from '../evaluation/sub-stages/productivity/productivity-sub-stage.component';
import { EmsDmsSubStageComponent } from '../evaluation/sub-stages/ems-dms/ems-dms-sub-stage.component';
import { SummarySubStageComponent } from '../evaluation/sub-stages/summary/summary-sub-stage.component';
import { ReviewSubmitSubStageComponent } from '../evaluation/sub-stages/review-submit/review-submit-sub-stage.component';
import { Application } from '../../../../services/application-status.service';

export interface EntityReview {
  name: string;
  status: 'submitted' | 'pending' | 'approved' | 'rejected' | 'accepted' | 'reevaluation';
  isExpanded?: boolean;
}

@Component({
  selector: 'app-review-stage',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, StatusBadgeComponent, GeneralSubStageComponent, EconomicImpactSubStageComponent, ProductivitySubStageComponent, EmsDmsSubStageComponent, SummarySubStageComponent, ReviewSubmitSubStageComponent],
  templateUrl: './review-stage.component.html',
  styleUrl: './review-stage.component.scss'
})
export class ReviewStageComponent implements OnInit, OnChanges {
  @Input() application?: Application;
  
  currentStep: number = 0;
  
  // Review subtabs for ADIO users
  reviewTabs = [
    { id: 0, label: 'Initial Review', status: 'pending' },
    { id: 1, label: 'External Review', status: 'pending' },
    { id: 2, label: 'Final Review', status: 'pending' }
  ];
  
  // Initial Review properties
  initialReviewComments: string = '';
  initialReviewStatus: 'submitted' | 'accepted' | 'returned' | 'rejected' | 'pending' | 'reevaluation' = 'pending';
  
  // Re-evaluation properties
  taqaReEvalComments: string = '';
  adPortsReEvalComments: string = '';
  
  // Final Review properties
  continueToCertification: boolean = false;
  certificateIssueDate: string = '';
  
  // Certificate hold properties
  certificateOnHold: boolean = false;
  certificateHoldReason: string = '';
  
  // External Review accordion states - first one expanded by default
  taqaAccordionExpanded: boolean = true;
  adPortsAccordionExpanded: boolean = false;
  
  // External Review statuses
  taqaStatus: 'submitted' | 'accepted' | 'returned' | 'reevaluation' = 'submitted';
  adPortsStatus: 'submitted' | 'accepted' | 'returned' | 'reevaluation' = 'submitted';
  
  // New properties for restructured review
  // TAQA and AD Ports confirmation file uploads
  taqaConfirmationFile: File | null = null;
  adPortsConfirmationFile: File | null = null;
  taqaConfirmationUploaded: boolean = false;
  adPortsConfirmationUploaded: boolean = false;
  
  // Evaluation approval properties
  evaluationApprovalStatus: 'pending' | 'approved' | 'returned' = 'pending';
  evaluationComments: string = '';
  approvalAccordionExpanded: boolean = false;
  
  entityReviews: EntityReview[] = [
    {
      name: 'Initial Review',
      status: 'pending',
      isExpanded: false
    },
    {
      name: 'TAQA Review',
      status: 'pending',
      isExpanded: false
    },
    {
      name: 'AD Ports Review', 
      status: 'pending',
      isExpanded: false
    },
    {
      name: 'Final Approval',
      status: 'pending',
      isExpanded: false
    }
  ];

  constructor(private router: Router, private route: ActivatedRoute) {
    // Get current step from query params
    this.route.queryParams.subscribe(params => {
      this.currentStep = parseInt(params['step']) || 0;
    });
  }

  // Tab navigation methods
  onTabChange(tabId: number) {
    this.currentStep = tabId;
    this.setDefaultStatuses(); // Update statuses when tab changes
    // Update URL with new step
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { step: tabId },
      queryParamsHandling: 'merge'
    });
  }

  canAccessTab(tabId: number): boolean {
    // Users can only access tabs sequentially
    if (tabId === 0) return true; // Initial Review always accessible
    
    // For External Review (tab 1): Initial Review must be completed
    if (tabId === 1) {
      return this.reviewTabs[0].status === 'completed';
    }
    
    // For Final Review (tab 2): Both Initial and External must be completed
    if (tabId === 2) {
      return this.reviewTabs[0].status === 'completed' && this.reviewTabs[1].status === 'completed';
    }
    
    return false;
  }

  getReviewStepClasses(stepIndex: number): string {
    if (stepIndex < this.currentStep) {
      // Completed step - black, not bold
      return 'text-black font-normal hover:text-gray-800 cursor-pointer text-sm';
    } else if (stepIndex === this.currentStep) {
      // Active step
      return 'text-primary font-semibold cursor-pointer text-sm';
    } else {
      // Pending step
      return 'text-gray-600 cursor-pointer text-sm';
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  }

  ngOnInit() {
    console.log('ReviewStageComponent - ngOnInit - Application:', this.application);
    this.setReviewStatuses();
    this.setDefaultStatuses();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['application'] && changes['application'].currentValue) {
      console.log('ReviewStageComponent - ngOnChanges - Application:', this.application);
      this.setReviewStatuses();
      this.setDefaultStatuses();
    }
  }

  public setDefaultStatuses() {
    // For certified applications, mark all reviews as completed
    if (this.application?.stage === 'Closed' && this.application?.status === 'Certified') {
      this.initialReviewStatus = 'accepted';
      this.taqaStatus = 'accepted';
      this.adPortsStatus = 'accepted';
      // Mark all review tabs as completed
      this.reviewTabs.forEach(tab => {
        tab.status = 'completed';
      });
      return;
    }
    
    // Set Initial Review to accepted for External Review and Final Review tabs
    if (this.currentStep >= 1 && this.initialReviewStatus !== 'accepted') {
      this.initialReviewStatus = 'accepted';
    }
    
    // Set TAQA and AD Ports to accepted for Final Review tab
    if (this.currentStep === 2) {
      if (this.taqaStatus !== 'accepted') {
        this.taqaStatus = 'accepted';
      }
      if (this.adPortsStatus !== 'accepted') {
        this.adPortsStatus = 'accepted';
      }
    }
  }

  private setReviewStatuses() {
    if (!this.application) {
      console.log('ReviewStageComponent - No application data');
      return;
    }

    console.log('ReviewStageComponent - Application status:', this.application.status);
    
    // Initialize all tabs as pending
    this.reviewTabs.forEach(tab => tab.status = 'pending');
    
    // Set current active tab
    this.reviewTabs[this.currentStep].status = 'active';
    
    // Set statuses based on application status
    switch (this.application.status) {
      case 'Initial Review':
        // User is in initial review stage
        this.reviewTabs[0].status = 'active';
        break;
        
      case 'External Review':
        // Initial review completed, external review active
        this.reviewTabs[0].status = 'completed';
        this.reviewTabs[1].status = 'active';
        this.currentStep = Math.max(this.currentStep, 1); // Ensure we're at least on External Review tab
        // Set accordion statuses - Initial Review is accepted/qualified
        this.entityReviews[0].status = 'accepted'; // Initial Review - show as accepted/qualified
        this.entityReviews[1].status = 'submitted'; // TAQA Review
        break;
        
      case 'Final Review':
        // Initial and external completed, final review active
        this.reviewTabs[0].status = 'completed';
        this.reviewTabs[1].status = 'completed';
        this.reviewTabs[2].status = 'active';
        this.currentStep = Math.max(this.currentStep, 2); // Ensure we're at least on Final Review tab
        // Set accordion statuses
        this.entityReviews[0].status = 'accepted'; // Initial Review - show as accepted
        this.entityReviews[1].status = 'submitted'; // TAQA Review
        this.entityReviews[2].status = 'submitted'; // AD Ports Review
        break;
        
      default:
        // Keep all as pending for other statuses
        this.reviewTabs[0].status = 'active';
        break;
    }
  }

  getStatusVariant(status: string): StatusBadgeVariant {
    switch (status) {
      case 'submitted': return 'success';
      case 'approved': return 'success';
      case 'accepted': return 'success';
      case 'pending': return 'pending';
      case 'rejected': return 'archived';
      default: return 'pending';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'submitted': return 'Completed';
      case 'approved': return 'Approved';
      case 'accepted': return 'Accepted';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  }

  getPendingMessage(): string {
    const pendingReviews = this.entityReviews.filter(review => review.status === 'pending');
    const completedReviews = this.entityReviews.filter(review => review.status === 'submitted');
    
    if (pendingReviews.length === 0) {
      return 'All reviews completed. Certificate ready for issuance.';
    }
    
    const pendingNames = pendingReviews.map(r => r.name).join(', ');
    const completedNames = completedReviews.map(r => r.name).join(', ');
    
    let message = `Certificate can only be issued after ${pendingNames} ${pendingReviews.length === 1 ? 'completes' : 'complete'} their review.`;
    
    if (completedReviews.length > 0) {
      message += ` ${completedNames} ${completedReviews.length === 1 ? 'has' : 'have'} already submitted their evaluation.`;
    }
    
    return message;
  }

  toggleAccordion(index: number) {
    console.log('Toggle accordion called for index:', index);
    console.log('Current expanded state:', this.entityReviews[index].isExpanded);
    this.entityReviews[index].isExpanded = !this.entityReviews[index].isExpanded;
    console.log('New expanded state:', this.entityReviews[index].isExpanded);
  }

  toggleTaqaAccordion() {
    this.taqaAccordionExpanded = !this.taqaAccordionExpanded;
    // Close other accordions when opening this one
    if (this.taqaAccordionExpanded) {
      this.adPortsAccordionExpanded = false;
      this.approvalAccordionExpanded = false;
    }
  }

  toggleAdPortsAccordion() {
    this.adPortsAccordionExpanded = !this.adPortsAccordionExpanded;
    // Close other accordions when opening this one
    if (this.adPortsAccordionExpanded) {
      this.taqaAccordionExpanded = false;
      this.approvalAccordionExpanded = false;
    }
  }

  getStatusVariantExternal(status: string): StatusBadgeVariant {
    switch (status) {
      case 'accepted': return 'success';
      case 'returned': return 'warning';
      case 'submitted': return 'active';
      default: return 'pending';
    }
  }

  getStatusTextExternal(status: string): string {
    switch (status) {
      case 'accepted': return 'Completed';
      case 'returned': return 'Pending';
      case 'submitted': return 'Completed';
      case 'pending': return 'Pending';
      case 'reevaluation': return 'Pending';
      default: return 'Pending';
    }
  }

  getAwaitingText(entity: string): string {
    return `Awaiting information from ${entity}`;
  }

  get isReadOnly(): boolean {
    return this.application?.stage === 'Review';
  }

  get isCBView(): boolean {
    return !this.router.url.startsWith('/adio');
  }

  get isInitialReviewStage(): boolean {
    // Show only Initial Review when status is 'Initial Review' or stage is 'Evaluation'
    return this.application?.status === 'Initial Review' || this.application?.stage === 'Evaluation';
  }

  get shouldShowInitialReviewAsAccepted(): boolean {
    // For ADIO subtab view: show as accepted in External Review and Final Review tabs
    if (!this.isCBView) {
      return (this.currentStep === 1 || this.currentStep === 2) && this.initialReviewStatus === 'accepted';
    }
    // For CB view: Show Initial Review as accepted (read-only) when not in Initial Review stage
    return !this.isInitialReviewStage && (this.application?.status === 'External Review' || this.application?.status === 'Final Review');
  }

  get shouldShowExternalReviewAsAccepted(): boolean {
    // For ADIO subtab view: show TAQA and AD Ports as accepted in Final Review tab
    if (!this.isCBView) {
      return this.currentStep === 2 && (this.taqaStatus === 'accepted' && this.adPortsStatus === 'accepted');
    }
    return false;
  }

  getVisibleEntityReviews(): EntityReview[] {
    if (this.isInitialReviewStage) {
      // Show only Initial Review for Evaluation stage
      const initialReview = this.entityReviews.filter(review => review.name === 'Initial Review');
      // Expand the Initial Review accordion by default when it's the only one shown
      if (initialReview.length > 0) {
        initialReview[0].isExpanded = true;
      }
      return initialReview;
    }
    
    // For TAQA and AD Ports stages, hide Final Approval
    if (this.application?.status === 'External Review') {
      // Show Initial Review, TAQA Review, and AD Ports Review (hide Final Approval)
      return this.entityReviews.filter(review => review.name !== 'Final Approval');
    }
    
    // Show all reviews for other stages (Final Review stage shows all)
    return this.entityReviews;
  }

  // Action methods for Initial Review
  acceptInitialEvaluation() {
    console.log('Accept initial evaluation clicked:', {
      comments: this.initialReviewComments
    });
    
    this.initialReviewStatus = 'accepted';
    
    // Complete Initial Review and enable External Review
    this.reviewTabs[0].status = 'completed';
    this.reviewTabs[1].status = 'active';
    
    // Auto-navigate to External Review tab after 1 second
    setTimeout(() => {
      this.onTabChange(1);
    }, 1000);
  }

  returnInitialForReEvaluation() {
    console.log('Return initial for re-evaluation clicked:', {
      comments: this.initialReviewComments
    });
    
    this.initialReviewStatus = 'returned';
  }

  rejectInitialEvaluation() {
    console.log('Reject initial evaluation clicked:', {
      comments: this.initialReviewComments
    });
    
    this.initialReviewStatus = 'rejected';
  }

  // Re-evaluation methods
  requestTaqaReEvaluation() {
    if (!this.taqaReEvalComments.trim()) {
      return;
    }
    
    console.log('TAQA re-evaluation requested:', {
      comments: this.taqaReEvalComments
    });
    
    // TODO: Implement actual re-evaluation request logic
  }

  requestAdPortsReEvaluation() {
    if (!this.adPortsReEvalComments.trim()) {
      return;
    }
    
    console.log('AD Ports re-evaluation requested:', {
      comments: this.adPortsReEvalComments
    });
    
    // TODO: Implement actual re-evaluation request logic
  }

  // External Review methods
  acceptTaqaEvaluation() {
    console.log('Accept TAQA evaluation:', { comments: this.taqaReEvalComments });
    this.taqaStatus = 'accepted';
    
    // Check if both TAQA and AD Ports are accepted to enable Final Review
    this.checkExternalReviewCompletion();
  }

  returnTaqaForReEvaluation() {
    console.log('Return TAQA for re-evaluation:', { comments: this.taqaReEvalComments });
    this.taqaStatus = 'returned';
  }

  acceptAdPortsEvaluation() {
    console.log('Accept AD Ports evaluation:', { comments: this.adPortsReEvalComments });
    this.adPortsStatus = 'accepted';
    
    // Check if both TAQA and AD Ports are accepted to enable Final Review
    this.checkExternalReviewCompletion();
  }

  returnAdPortsForReEvaluation() {
    console.log('Return AD Ports for re-evaluation:', { comments: this.adPortsReEvalComments });
    this.adPortsStatus = 'returned';
  }

  private checkExternalReviewCompletion() {
    // Only proceed to Final Review if both TAQA and AD Ports are accepted
    if (this.taqaStatus === 'accepted' && this.adPortsStatus === 'accepted') {
      // Complete External Review and enable Final Review
      this.reviewTabs[1].status = 'completed';
      this.reviewTabs[2].status = 'active';
      
      // Auto-navigate to Final Review tab
      setTimeout(() => {
        this.onTabChange(2);
      }, 1000);
    }
  }

  // Final Review methods
  getCertificateExpiryDate(): string {
    if (!this.certificateIssueDate) return '';
    const issueDate = new Date(this.certificateIssueDate);
    const expiryDate = new Date(issueDate.setFullYear(issueDate.getFullYear() + 1));
    return expiryDate.toISOString().split('T')[0];
  }

  previewCertificate() {
    window.open('assets/certificate_sample.pdf', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
  }

  issueCertificate() {
    console.log('Issuing certificate with issue date:', this.certificateIssueDate);
    
    // Complete Final Review
    this.reviewTabs[2].status = 'completed';
    
    // TODO: Implement actual certificate issuance logic
  }

  proceedToCertification() {
    console.log('Proceeding to certification');
    
    // Complete Final Review
    this.reviewTabs[2].status = 'completed';
    
    // TODO: Implement actual certification logic
  }

  // Return for Re-evaluation method (handles both signatures)
  returnForReEvaluation(reviewType?: 'initial') {
    // Handle the old signature for Initial Review
    if (reviewType === 'initial') {
      console.log(`Returning ${reviewType} review for re-evaluation`);
      this.initialReviewStatus = 'reevaluation';
      this.certificateHoldReason = 'Initial Review returned for re-evaluation to certifying body';
      this.certificateOnHold = true;
      this.certificateIssueDate = '';
      return;
    }
    
    // Handle the new signature for Evaluation approval
    if (!this.evaluationComments.trim()) {
      alert('Please enter comments before returning for re-evaluation');
      return;
    }
    
    console.log('Returning for re-evaluation with comments:', this.evaluationComments);
    this.evaluationApprovalStatus = 'returned';
    
    // Put certificate on hold
    this.certificateOnHold = true;
    this.certificateHoldReason = 'Evaluation returned for re-evaluation to certifying body';
    
    // Clear certificate issue date
    this.certificateIssueDate = '';
  }

  // New methods for restructured review
  toggleApprovalAccordion() {
    this.approvalAccordionExpanded = !this.approvalAccordionExpanded;
    // Close other accordions when opening this one
    if (this.approvalAccordionExpanded) {
      this.taqaAccordionExpanded = false;
      this.adPortsAccordionExpanded = false;
    }
  }

  onTaqaConfirmationUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.taqaConfirmationFile = target.files[0];
      this.taqaConfirmationUploaded = true;
      console.log('TAQA confirmation uploaded:', this.taqaConfirmationFile.name);
    }
  }

  onAdPortsConfirmationUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.adPortsConfirmationFile = target.files[0];
      this.adPortsConfirmationUploaded = true;
      console.log('AD Ports confirmation uploaded:', this.adPortsConfirmationFile.name);
    }
  }

  approveEvaluation() {
    console.log('Approving evaluation with comments:', this.evaluationComments);
    this.evaluationApprovalStatus = 'approved';
  }

  getEvaluationStatusText(status: string): string {
    switch (status) {
      case 'approved': return 'Approved';
      case 'returned': return 'Returned';
      case 'pending': return 'Pending';
      default: return 'Pending';
    }
  }

  getEvaluationStatusVariant(status: string): StatusBadgeVariant {
    switch (status) {
      case 'approved': return 'success';
      case 'returned': return 'warning';
      case 'pending': return 'pending';
      default: return 'pending';
    }
  }
}