import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

import {
  TopCardComponent, PreviewCardComponent, PageHeaderComponent, IconComponent,
  StatusBadgeComponent, ProgressBarComponent, FilterButtonComponent, ViewToggleComponent,
  StatsCardComponent, StatusFilterButtonComponent, TablePaginationComponent, ActionButtonsComponent,
  DataTableComponent
} from '@components/ui/_index';

import { SelectOption, DataTableColumn } from '@models/ui/_index';
import {
  ApplicationSummaryDto, ApplicationStatusDto, AppType, Stage, ApplicationDetail
} from '@models/esp/_index';

import {
  ApplicationFiltersService, BaseApplicationFilterService, ApplicationStatusService,
  ApplicationAssignmentService, BaseApplicationsSummaryService, BaseApplicationsService
} from '@services/_index';


import { CompactSearchComponent } from './compact-search/compact-search.component';
import { AppLauncherService } from '@services/app-launcher/app-launcher.service';

// Add interface for Application
interface Application {
  id: string;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, TopCardComponent, PreviewCardComponent,
    PageHeaderComponent, IconComponent, StatusBadgeComponent, ProgressBarComponent,
    FilterButtonComponent, ViewToggleComponent, StatsCardComponent, StatusFilterButtonComponent,
    TablePaginationComponent, ActionButtonsComponent, DataTableComponent, CompactSearchComponent],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})

export class ApplicationsComponent implements OnInit {
  selectedApplication: Application | null = null;
  selectedFilter: string = 'All';
  selectedSubStatus: string = '';
  selectedApplicationType: string = 'all';
  searchQuery: string = '';
  filteredApplications: ApplicationStatusDto[] = [];
  paginatedApplications: ApplicationStatusDto[] = [];
  viewMode: 'grid' | 'table' = 'grid';

  // Pagination properties
  currentPage: number = 1;
  perPage: number = 12; // 12 items per page for grid view (3x4 grid)
  totalItems: number = 0;

  applicationTypeOptions: SelectOption[] = [];
  appTypes: AppType[] = [];
  stages: Stage[] = [];
  applications: ApplicationStatusDto[] = [];
  applicationsSummary: ApplicationSummaryDto[] = [];

  constructor(
    private router: Router,
    private appLauncherService: AppLauncherService,
    public applicationStatusService: ApplicationStatusService,
    public applicationAssignmentService: ApplicationAssignmentService,
    public applicationFiltersService: ApplicationFiltersService,
    private baseApplicationFilterService: BaseApplicationFilterService,
    private baseApplicationsService: BaseApplicationsService,
    private baseApplicationsSummaryService: BaseApplicationsSummaryService
  ) { }

  ngOnInit() {
    this.appLauncherService.selectedApplication$.subscribe(
      (application) => {
        this.selectedApplication = application;
        //this.loadAndFilterNavigationMenu();
      }
    )
    this.loadFilters();
    // this.loadApplicationsData(); // Using summary data instead
    this.loadApplicationsSummary();
  }

  private loadFilters() {
    this.baseApplicationFilterService.getApplicationFilters().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.appTypes = response.data.appTypes;
          this.stages = response.data.stages;
          this.applicationTypeOptions = this.convertAppTypesToSelectOptions(response.data.appTypes);

        } else {
          console.error('Failed to load application filters:', response.errors);
        }
      },
      error: (error) => {
        console.error('Error loading application filters:', error);
      }
    });
  }


  private convertAppTypesToSelectOptions(appTypes: AppType[]): SelectOption[] {
    return [
      { label: 'All Types', value: 'all' },
      ...appTypes.map(type => ({
        label: type.appTypeName,
        value: type.appTypeId.toString()
      }))
    ];
  }

  private convertApplicationItems(items: ApplicationDetail[]): ApplicationStatusDto[] {
    return items.map(item => ({
      id: item.id,
      companyName: item.companyName,
      companyType: item.companyType,
      stage: this.mapStage(item.stage),
      status: this.mapStatus(item.status),
      progress: item.progress,
      date: item.date,
      deadline: item.deadline,
      category: item.category,
      assignee: item.assignee,
      contactName: item.contactName,
      contactPosition: item.contactPosition,
      contactEmail: item.contactEmail,
      contactPhone: item.contactPhone,
      issueDate: item.issueDate,
      expiryDate: item.expiryDate,
      rejectionReason: item.rejectionReason,
      cancellationReason: item.cancellationReason
    }));
  }

  private mapStage(stage: string): 'Quotation' | 'Evaluation' | 'Review' | 'Closed' {
    const stageMap: { [key: string]: 'Quotation' | 'Evaluation' | 'Review' | 'Closed' } = {
      'RFQ': 'Quotation',
      'Quotation': 'Quotation',
      'Evaluation': 'Evaluation',
      'Review': 'Review',
      'Close': 'Closed',
      'Closed': 'Closed'
    };
    return stageMap[stage] || 'Quotation';
  }

  private mapStatus(status: string): 'Pending' | 'Submitted' | 'In Progress' | 'Returned' | 'Initial Review' | 'External Review' | 'Final Review' | 'Certified' | 'Not Awarded' | 'Cancelled' | 'Rejected' {
    const statusMap: { [key: string]: 'Pending' | 'Submitted' | 'In Progress' | 'Returned' | 'Initial Review' | 'External Review' | 'Final Review' | 'Certified' | 'Not Awarded' | 'Cancelled' | 'Rejected' } = {
      // Handle both lowercase and capitalized versions from API
      'pending': 'Pending',
      'Pending': 'Pending',
      'submitted': 'Submitted',
      'Submitted': 'Submitted',
      'In progress': 'In Progress',
      'In Progress': 'In Progress',
      'Returned': 'Returned',
      'initial review': 'Initial Review',
      'Initial Review': 'Initial Review',
      'external review': 'External Review',
      'External Review': 'External Review',
      'final review': 'Final Review',
      'Final Review': 'Final Review',
      'certified': 'Certified',
      'Certified': 'Certified',
      'not certified': 'Not Awarded',
      'Not Awarded': 'Not Awarded',
      'cancelled': 'Cancelled',
      'canceled': 'Cancelled',
      'Cancelled': 'Cancelled',
      'expired': 'Rejected',
      'Rejected': 'Rejected'
    };
    return statusMap[status] || 'Pending';
  }

  private loadApplicationsSummary() {
    this.baseApplicationsSummaryService.getApplicationsSummary().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.applicationsSummary = response.data;
          debugger;


          // Convert summary data to applications for display
          this.applications = this.convertSummaryToApplications(response.data);
          this.updateFilteredApplications();
        } else {
          console.error('Failed to load applications summary:', response.errors);
        }
      },
      error: (error) => {
        console.error('Error loading applications summary:', error);
      }
    });
  }

  private convertSummaryToApplications(summaryItems: ApplicationSummaryDto[]): ApplicationStatusDto[] {
    return summaryItems.map(item => ({
      id: item.appReferenceNumber,
      appId: item.appId, // Add numeric appId for navigation
      companyName: item.invCompanyName,
      companyType: item.appTypeName,
      stage: this.mapStage(item.wfStgName),
      status: this.mapStatus(item.wfSubstgName),
      progress: item.wfSubstgProgress,
      date: new Date().toLocaleDateString(), // You might want to get this from the API
      assignee: 'ADIO', // You might want to get this from the API
      category: this.getCategoryFromServices(item.appIsElectricity, item.appIsGas),
      services: this.getServicesArray(item.appIsElectricity, item.appIsGas),
      compliance: 'On Track' // You might want to calculate this based on progress
    }));
  }

  private getCategoryFromServices(isElectricity: boolean, isGas: boolean): string {
    if (isElectricity && isGas) return 'Electricity,Gas';
    if (isElectricity) return 'Electricity';
    if (isGas) return 'Gas';
    return 'Electricity';
  }

  private getServicesArray(isElectricity: boolean, isGas: boolean): string[] {
    const services: string[] = [];
    if (isElectricity) services.push('Electricity');
    if (isGas) services.push('Gas');
    return services.length > 0 ? services : ['Electricity'];
  }

  private filterApplicationsFromSummary(): ApplicationStatusDto[] {
    let filteredSummary = this.applicationsSummary;


    // Filter by stage if not "All"
    if (this.selectedFilter !== 'All') {
      const stageMap: { [key: string]: string } = {
        'RFQ': 'RFQ',
        'Quotation': 'Quotation', // Quotation maps to API 'Quotation' stage
        'Evaluation': 'Evaluation',
        'Review': 'Review',
        'Closed': 'Closed', // Closed maps to API 'Closed' stage
        'Close': 'Closed'
      };

      const apiStageName = stageMap[this.selectedFilter] || this.selectedFilter;

      filteredSummary = filteredSummary.filter(app => app.wfStgName === apiStageName);

    }

    // Filter by sub-status if selected
    if (this.selectedSubStatus) {
      filteredSummary = filteredSummary.filter(app =>
        app.wfSubstgName.toLowerCase() === this.selectedSubStatus.toLowerCase()
      );
    }

    // Convert filtered summary to applications
    return this.convertSummaryToApplications(filteredSummary);
  }

  // private loadApplicationsData() {
  //   this.baseApplicationsService.getApplications().subscribe({
  //     next: (response) => {
  //       if (response.isSuccess && response.data) {
  //         // Convert ApplicationItem to Application format for compatibility
  //         this.applications = this.convertApplicationItems(response.data);
  //         this.updateFilteredApplications();
  //       } else {
  //         console.error('Failed to load applications:', response.errors);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error loading applications:', error);
  //     }
  //   });
  // }


  get applicationTypes() {
    // Convert API stages to the format expected by the template
    return this.stages.map(stage => ({
      name: stage.wfStgName,
      description: `${stage.wfStgName} stage applications`,
      icon: this.convertFontAwesomeIcon(stage.wfStgIcon),
      color: `color: ${stage.wfStgColor}`
    }));
  }

  private convertFontAwesomeIcon(faIcon: string): string {
    // Convert FontAwesome icons to Material Icons or keep as is
    const iconMap: { [key: string]: string } = {
      'fa-file-text-o': 'request_quote',
      'fa-cogs': 'fact_check',
      'fa-search': 'rate_review',
      'fa-archive': 'check_circle'
    };
    return iconMap[faIcon] || 'file_text';
    // return this.applicationStatusService.getApplicationStages();
  }

  filterApplications(stage: string) {
    this.selectedFilter = stage;
    this.selectedSubStatus = '';
    this.updateFilteredApplications();
  }

  filterBySubStatus(subStatus: string) {
    if (subStatus === 'All') {
      this.selectedSubStatus = '';
    } else {
      this.selectedSubStatus = this.selectedSubStatus === subStatus ? '' : subStatus;
    }
    this.updateFilteredApplications();
  }

  private updateFilteredApplications() {
    // First apply stage and sub-status filtering
    let filtered: ApplicationStatusDto[];

    if (this.applicationsSummary.length > 0) {
      // Use summary-based filtering
      filtered = this.filterApplicationsFromSummary();
    } else {
      // Fallback to existing method
      filtered = this.applicationStatusService.filterApplications(
        this.applications, this.selectedFilter, this.selectedSubStatus
      );
    }

    // Then apply application type filtering
    if (this.selectedApplicationType !== 'all') {



      // Check if selectedApplicationType is a numeric ID (from API) or string value (from mock)
      const isNumericId = /^\d+$/.test(this.selectedApplicationType);
      if (isNumericId) {
        // Find the app type name by ID for API-based filtering
        const appType = this.appTypes.find(type => type.appTypeId.toString() === this.selectedApplicationType);

        if (appType) {

          filtered = filtered.filter(app => {
            const match = app.companyType === appType.appTypeName;
            if (match)
              return match;
            else
              return false
          });
        }
      } else {
        // Legacy mock data filtering

        filtered = filtered.filter(app => {
          const match = app.companyType === this.selectedApplicationType;
          if (match)
            return match;
          else
            return false;
        });
      }

    }

    // Apply search filtering
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(app =>
        app.id.toLowerCase().includes(query) ||
        app.companyName.toLowerCase().includes(query) ||
        app.status.toLowerCase().includes(query) ||
        app.stage.toLowerCase().includes(query) ||
        (app.contactName && app.contactName.toLowerCase().includes(query)) ||
        (app.assignee && app.assignee.toLowerCase().includes(query))
      );
    }

    this.filteredApplications = filtered;
    this.totalItems = filtered.length;

    // Reset to first page when filters change
    this.currentPage = 1;
    this.updatePagination();
  }

  private updatePagination() {
    const startIndex = (this.currentPage - 1) * this.perPage;
    const endIndex = startIndex + this.perPage;
    this.paginatedApplications = this.filteredApplications.slice(startIndex, endIndex);
  }

  onApplicationTypeSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedApplicationType = target.value;
    this.updateFilteredApplications();
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.updateFilteredApplications();
  }

  getApplicationTypeDisplayText(): string {
    if (this.selectedApplicationType === 'all') {
      return 'All Types';
    }
    const selectedOption = this.applicationTypeOptions.find(option => option.value === this.selectedApplicationType);
    return selectedOption ? selectedOption.label : 'All Types';
  }

  getTabClasses(subStatus: string): string {
    const isActive = this.selectedSubStatus === subStatus || (subStatus === 'All' && !this.selectedSubStatus);
    return isActive
      ? 'px-4 py-2 text-sm font-medium text-primary border-b-2 border-primary bg-transparent'
      : 'px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border-b-2 border-transparent bg-transparent';
  }

  isSLAViolation(app: ApplicationStatusDto): boolean {
    if (!app.deadline) return false;
    const today = new Date();
    const deadlineDate = new Date(app.deadline);
    return today > deadlineDate && app.stage !== 'Closed';
  }

  hasNotifications(app: ApplicationStatusDto): boolean {
    // Show notifications only for returned applications and all closed states
    return app.status === 'Returned' ||
      app.stage === 'Closed';
  }

  navigateToDetail(applicationId: string) {
    this.router.navigate(['/esp/cb/applications', applicationId]);
  }

  navigateToDetailById(appId: number) {
    this.router.navigate(['/esp/cb/applications', appId.toString()]);
  }

  navigateToDetailWithStage(app: ApplicationStatusDto) {
    const queryParams: any = { step: 0 };

    // Determine the correct stage based on RFQ substage
    if (app.stage === 'Quotation') {
      if (app.status?.toLowerCase() === 'submitted') {
        queryParams.stage = 'Quotation';
      } else {
        queryParams.stage = 'Application';
      }
    } else if (app.stage === 'Evaluation') {
      queryParams.stage = 'Evaluation';
    } else if (app.stage === 'Review') {
      queryParams.stage = 'Review';
    } else if (app.stage === 'Closed') {
      queryParams.stage = 'Completed';
    } else {
      queryParams.stage = 'Application';
    }

    // Use numeric appId if available, otherwise fallback to string id
    const applicationId = app.appId ? app.appId.toString() : app.id;
    this.router.navigate(['/esp/cb/applications', applicationId], { queryParams });
  }

  getApplicationCount = (stage: string) => {




    if (this.applicationsSummary.length > 0) {
      const count = this.getApplicationCountFromSummary(stage);

      return count;
    }
    const fallbackCount = this.applicationStatusService.getApplicationCount(this.applications, stage);

    return fallbackCount;
  };

  private getApplicationCountFromSummary(stage: string): number {
    if (stage === 'All') {
      return this.applicationsSummary.length;
    }

    // Map the display stage names to API stage names
    const stageMap: { [key: string]: string } = {
      'RFQ': 'RFQ',
      'Quotation': 'Quotation', // Quotation maps to API 'Quotation' stage
      'Evaluation': 'Evaluation',
      'Review': 'Review',
      'Closed': 'Closed', // Closed maps to API 'Closed' stage
      'Close': 'Closed'
    };

    const apiStageName = stageMap[stage] || stage;

    const count = this.applicationsSummary.filter(app => app.wfStgName === apiStageName).length;


    return count;
  }
  isFilterActive = (stage: string) => this.selectedFilter === stage;
  getSubStatuses = (stage: string) => {
    if (this.applicationsSummary.length > 0) {
      return this.getSubStatusesFromSummary(stage);
    }
    return this.applicationStatusService.getSubStatuses(this.applications, stage);
  };

  private getSubStatusesFromSummary(stage: string): string[] {
    if (stage === 'All') return [];

    // Map the display stage names to API stage names
    const stageMap: { [key: string]: string } = {
      'RFQ': 'RFQ',
      'Quotation': 'Quotation', // Quotation maps to API 'Quotation' stage
      'Evaluation': 'Evaluation',
      'Review': 'Review',
      'Closed': 'Closed', // Closed maps to API 'Closed' stage
      'Close': 'Closed'
    };

    const apiStageName = stageMap[stage] || stage;
    const stageApplications = this.applicationsSummary.filter(app => app.wfStgName === apiStageName);
    const subStatuses = [...new Set(stageApplications.map(app => app.wfSubstgName))];
    return subStatuses;
  }
  shouldShowSubStatus = (stage: string) => stage !== 'All' && this.getSubStatuses(stage).length > 0;

  toggleView(mode: 'grid' | 'table') {
    this.viewMode = mode;
  }

  tableColumns: DataTableColumn[] = [
    { field: 'id', label: 'Application ID', sortable: true, width: '100px' },
    { field: 'companyName', label: 'Company Name', sortable: true, width: '200px' },
    { field: 'status', label: 'Status', sortable: true, width: '160px' },
    { field: 'categories', label: 'Request', sortable: false, width: '80px' },
    { field: 'progress', label: 'Status', sortable: true, width: '160px' },
    { field: 'assignee', label: 'Assignee', sortable: true, width: '140px' },
    { field: 'actions', label: 'Actions', sortable: false, width: '120px' }
  ];

  getApplicationTypeLabel(value: string): string {
    const typeOption = this.applicationTypeOptions.find(option => option.value === value);
    return typeOption ? typeOption.label : value || 'Unknown';
  }

  getStatusBadgeClassName(app: ApplicationStatusDto): string {
    return this.applicationStatusService.isClosedAndNotCertified(app.stage, app.status)
      ? 'bg-gray-400 text-black'
      : '';
  }

  getApplicationCategories(app: ApplicationStatusDto): string[] {
    return (app.category || this.getDefaultCategory()).split(',').map(cat => cat.trim());
  }

  private getDefaultCategory(): string {
    return 'Electricity';
  }


  shouldShowOverdueAlert(stageName: string): boolean {
    return stageName === 'Quotation';
  }

  getOverdueAlertText(): string {
    return '1 Overdue';
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  onPerPageChange(perPage: number) {
    this.perPage = perPage;
    this.currentPage = 1; // Reset to first page when changing page size
    this.updatePagination();
  }

  onNotificationClick(app: ApplicationStatusDto, event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent row/card click
    }

    // TODO: Implement notification handling logic
    // Could open a modal, navigate to notifications page, etc.
  }

  onSLAClick(app: ApplicationStatusDto, event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent row/card click
    }

    // TODO: Implement SLA alert handling logic
    // Could show SLA details, timeline, etc.
  }

  getAssigneeIcon(assignee: string): string {
    switch (assignee) {
      case 'Certifying Body':
        return 'building';
      case 'Applicant':
        return 'user';
      case 'ADIO':
      case 'TAQA':
      case 'AD Ports':
        return 'building-2';
      default:
        return 'user';
    }
  }

  getRowClasses = (app: ApplicationStatusDto): string => {
    return this.applicationAssignmentService.isLocked(app) ? 'locked' : '';
  };

  onTableRowClick(app: ApplicationStatusDto) {
    if (app.status === 'Cancelled') {
      return; // Prevent navigation for cancelled applications
    }
    this.navigateToDetailWithStage(app);
  }

  onCardClick(app: ApplicationStatusDto) {
    if (app.status === 'Cancelled') {
      return; // Prevent navigation for cancelled applications
    }
    this.navigateToDetailWithStage(app);
  }

  onCardHover(app: ApplicationStatusDto, isHovering: boolean) {
    if (app.status === 'Cancelled' && isHovering) {
      // Could add visual feedback here (cursor style is handled via CSS)
    }
  }

  isClosedApplication(app: ApplicationStatusDto): boolean {
    return app.stage === 'Closed';
  }

  getClosedStatusDisplayText(app: ApplicationStatusDto): string {
    return this.applicationStatusService.getClosedStatusText(app);
  }

  isCertificateExpired(app: ApplicationStatusDto): boolean {
    return this.applicationStatusService.isCertificateExpired(app);
  }

  getReasonForStatus(app: ApplicationStatusDto): string {
    switch (app.status) {
      case 'Not Awarded':
        return app.rejectionReason || 'Quotation Not Approved';
      case 'Rejected':
        return app.rejectionReason || 'Evaluation Rejected';
      case 'Cancelled':
        return app.cancellationReason || 'No response from applicant';
      default:
        return '';
    }
  }

  // API-based color and icon methods
  getStageColor(stageName: string): void {
    this.baseApplicationFilterService.getStageColor(stageName).subscribe(color => {
      // Use the color in your template or store it
    });
  }

  getSubStageColor(subStageName: string): void {
    this.baseApplicationFilterService.getSubStageColor(subStageName).subscribe(color => {
      // Use the color in your template or store it
    });
  }

  getStageIcon(stageName: string): void {
    this.baseApplicationFilterService.getStageIcon(stageName).subscribe(icon => {
      // Use the icon in your template or store it
    });
  }

  getSubStageIcon(subStageName: string): void {
    this.baseApplicationFilterService.getSubStageIcon(subStageName).subscribe(icon => {
      // Use the icon in your template or store it
    });
  }
}
