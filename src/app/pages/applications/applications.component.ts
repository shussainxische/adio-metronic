import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { TopCardComponent } from '../../components/ui/top-card/top-card.component';
import { PreviewCardComponent } from '../../components/ui/preview-card/preview-card.component';
import { PageHeaderComponent } from '../../components/ui/page-header/page-header.component';
import { IconComponent } from '../../components/ui/icon/icon.component';
import { StatusBadgeComponent } from '../../components/ui/status-badge/status-badge.component';
import { ProgressBarComponent } from '../../components/ui/progress-bar/progress-bar.component';
import { DropdownFilterComponent } from '../../components/ui/dropdown-filter/dropdown-filter.component';
import { AdioButtonComponent } from '../../components/ui/adio-button/adio-button.component';
import { ApplicationStatusService, Application } from '../../services/application-status.service';
import { ApplicationAssignmentService } from '../../services/application-assignment.service';
import { ApplicationFiltersService, AppType, Stage } from '../../services/application-filters.service';
import { BaseApplicationFilterService } from '../../services/base-application-filter.service';
import { ApplicationsService, ApplicationData } from '../../services/applications.service';
import { BaseApplicationsService, ApplicationItem } from '../../services/base-applications.service';
import { BaseApplicationsSummaryService, ApplicationSummaryItem } from '../../services/base-applications-summary.service';
import { TableComponent } from '../../components/ui/table/table/table.component';
import { TableHeaderComponent } from '../../components/ui/table/table-header/table-header.component';
import { TableBodyComponent } from '../../components/ui/table/table-body/table-body.component';
import { TableRowComponent } from '../../components/ui/table/table-row/table-row.component';
import { TableCellComponent } from '../../components/ui/table/table-cell/table-cell.component';
import { FilterButtonComponent } from '../../components/ui/filter-button/filter-button.component';
import { ViewToggleComponent } from '../../components/ui/view-toggle/view-toggle.component';
import { SelectDropdownComponent, SelectOption } from '../../components/ui/select-dropdown/select-dropdown.component';
import { StatsCardComponent } from '../../components/ui/stats-card/stats-card.component';
import { StatusFilterButtonComponent } from '../../components/ui/status-filter-button/status-filter-button.component';
import { AssigneeInfoComponent } from '../../components/ui/assignee-info/assignee-info.component';
import { TablePaginationComponent } from '../../components/ui/table/table-pagination/table-pagination.component';
import { ActionButtonsComponent } from '../../components/ui/action-buttons/action-buttons.component';
import { DataTableComponent, DataTableColumn } from '../../components/ui/data-table/data-table.component';
import { InputComponent } from '../../components/ui/input/input.component';


@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, TopCardComponent, PreviewCardComponent, PageHeaderComponent, IconComponent, StatusBadgeComponent, ProgressBarComponent, FilterButtonComponent, ViewToggleComponent, SelectDropdownComponent, StatsCardComponent, StatusFilterButtonComponent, AssigneeInfoComponent, TablePaginationComponent, ActionButtonsComponent, DataTableComponent, InputComponent],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})

export class ApplicationsComponent implements OnInit {
  selectedFilter: string = 'All';
  selectedSubStatus: string = '';
  selectedApplicationType: string = 'all';
  searchQuery: string = '';
  filteredApplications: Application[] = [];
  paginatedApplications: Application[] = [];
  viewMode: 'grid' | 'table' = 'grid';
  
  // Pagination properties
  currentPage: number = 1;
  perPage: number = 12; // 12 items per page for grid view (3x4 grid)
  totalItems: number = 0;

  applicationTypeOptions: SelectOption[] = [];
  appTypes: AppType[] = [];
  stages: Stage[] = [];
  applications: Application[] = [];
  applicationsSummary: ApplicationSummaryItem[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    public applicationStatusService: ApplicationStatusService,
    public applicationAssignmentService: ApplicationAssignmentService,
    public applicationFiltersService: ApplicationFiltersService,
    private baseApplicationFilterService: BaseApplicationFilterService,
    private baseApplicationsService: BaseApplicationsService,
    private baseApplicationsSummaryService: BaseApplicationsSummaryService
  ) {}

  ngOnInit() {
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

  private convertApplicationItems(items: ApplicationItem[]): Application[] {
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

  private convertSummaryToApplications(summaryItems: ApplicationSummaryItem[]): Application[] {
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

  private filterApplicationsFromSummary(): Application[] {
    let filteredSummary = this.applicationsSummary;

    // Filter by stage if not "All"
    if (this.selectedFilter !== 'All') {
      const stageMap: { [key: string]: string } = {
        'RFQ': 'RFQ',
        'Quotation': 'RFQ',
        'Evaluation': 'Evaluation', 
        'Review': 'Review',
        'Closed': 'Close',
        'Close': 'Close'
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
 
  private loadApplicationsData() {
    this.baseApplicationsService.getApplications().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data?.applications) {
          // Convert ApplicationItem to Application format for compatibility
          this.applications = this.convertApplicationItems(response.data.applications);
          this.updateFilteredApplications();
        } else {
          console.error('Failed to load applications:', response.errors);
        }
      },
      error: (error) => {
        console.error('Error loading applications:', error);
      }
    });
  }
 

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
    this.selectedSubStatus = this.selectedSubStatus === subStatus ? '' : subStatus;
    this.updateFilteredApplications();
  }

  private updateFilteredApplications() {
    // First apply stage and sub-status filtering
    let filtered: Application[];
    
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
          filtered = filtered.filter(app => app.companyType === appType.appTypeName.toLowerCase().replace(/\s+/g, '-'));
        }
      } else {
        // Legacy mock data filtering
      filtered = filtered.filter(app => app.companyType === this.selectedApplicationType);
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

  onApplicationTypeSelectChange(value: string) {
    this.selectedApplicationType = value;
    this.updateFilteredApplications();
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.updateFilteredApplications();
  }

  isSLAViolation(app: Application): boolean {
    if (!app.deadline) return false;
    const today = new Date();
    const deadlineDate = new Date(app.deadline);
    return today > deadlineDate && app.stage !== 'Closed';
  }

  hasNotifications(app: Application): boolean {
    // Show notifications only for returned applications and all closed states
    return app.status === 'Returned' || 
           app.stage === 'Closed';
  }

  navigateToDetail(applicationId: string) {
    this.router.navigate(['/applications', applicationId]);
  }

  navigateToDetailById(appId: number) {
    this.router.navigate(['/applications', appId.toString()]);
  }

  navigateToDetailWithStage(app: Application) {
    const queryParams: any = { step: 0 };
    
    // Determine the correct stage based on RFQ substage
    if (app.stage === 'RFQ') {
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
    this.router.navigate(['/applications', applicationId], { queryParams });
  }

  getApplicationCount = (stage: string) => {
    if (this.applicationsSummary.length > 0) {
      return this.getApplicationCountFromSummary(stage);
    }
    return this.applicationStatusService.getApplicationCount(this.applications, stage);
  };

  private getApplicationCountFromSummary(stage: string): number {
    if (stage === 'All') {
      return this.applicationsSummary.length;
    }

    // Map the display stage names to API stage names
    const stageMap: { [key: string]: string } = {
      'RFQ': 'RFQ',
      'Quotation': 'RFQ',
      'Evaluation': 'Evaluation',
      'Review': 'Review',
      'Closed': 'Close',
      'Close': 'Close'
    };

    const apiStageName = stageMap[stage] || stage;
    return this.applicationsSummary.filter(app => app.wfStgName === apiStageName).length;
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
      'Quotation': 'RFQ',
      'Evaluation': 'Evaluation',
      'Review': 'Review',
      'Closed': 'Close',
      'Close': 'Close'
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

  getStatusBadgeClassName(app: Application): string {
    return this.applicationStatusService.isClosedAndNotCertified(app.stage, app.status) 
      ? 'bg-gray-400 text-black' 
      : '';
  }

  getApplicationCategories(app: Application): string[] {
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

  onNotificationClick(app: Application, event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent row/card click
    }
    console.log('Notification clicked for application:', app.id);
    // TODO: Implement notification handling logic
    // Could open a modal, navigate to notifications page, etc.
  }

  onSLAClick(app: Application, event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent row/card click
    }
    console.log('SLA alert clicked for application:', app.id);
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

  getRowClasses = (app: Application): string => {
    return this.applicationAssignmentService.isLocked(app) ? 'locked' : '';
  };

  onTableRowClick(app: Application) {
    if (app.status === 'Cancelled') {
      return; // Prevent navigation for cancelled applications
    }
    this.navigateToDetailWithStage(app);
  }

  onCardClick(app: Application) {
    if (app.status === 'Cancelled') {
      return; // Prevent navigation for cancelled applications
    }
    this.navigateToDetailWithStage(app);
  }

  onCardHover(app: Application, isHovering: boolean) {
    if (app.status === 'Cancelled' && isHovering) {
      // Could add visual feedback here (cursor style is handled via CSS)
    }
  }

  isClosedApplication(app: Application): boolean {
    return app.stage === 'Closed';
  }

  getClosedStatusDisplayText(app: Application): string {
    return this.applicationStatusService.getClosedStatusText(app);
  }

  isCertificateExpired(app: Application): boolean {
    return this.applicationStatusService.isCertificateExpired(app);
  }

  getReasonForStatus(app: Application): string {
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
