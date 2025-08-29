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
import { ApplicationsService, ApplicationData } from '../../services/applications.service';
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
 
 
@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, TopCardComponent, PreviewCardComponent, PageHeaderComponent, IconComponent, StatusBadgeComponent, ProgressBarComponent, FilterButtonComponent, ViewToggleComponent, SelectDropdownComponent, StatsCardComponent, StatusFilterButtonComponent, AssigneeInfoComponent, TablePaginationComponent, ActionButtonsComponent, DataTableComponent],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})
 
export class ApplicationsComponent implements OnInit {
  selectedFilter: string = 'All';
  selectedSubStatus: string = '';
  selectedApplicationType: string = 'all';
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
 
  constructor(
    private router: Router,
    private http: HttpClient,
    public applicationStatusService: ApplicationStatusService,
    public applicationAssignmentService: ApplicationAssignmentService,
    public applicationFiltersService: ApplicationFiltersService,
    private applicationsService: ApplicationsService
  ) {}
 
  ngOnInit() {
    this.loadFilters();
    this.loadApplicationsData();
  }
 
  private loadFilters() {
    this.applicationFiltersService.loadFilters().subscribe({
      next: (filters) => {
        debugger;
        this.appTypes = filters.appTypes;
        this.stages = filters.stages;
        this.applicationTypeOptions = this.applicationFiltersService.getAppTypeOptions();
      },
      error: (error) => {
        console.error('Error loading application filters:', error);
        // Fallback to mock data if API fails
        this.loadMockFilters();
      }
    });
  }
 
  private loadMockFilters() {
    this.http.get<{applicationTypeOptions: SelectOption[], applicationStages?: any[]}>('assets/mock-data/applications.json')
      .subscribe(data => {
        this.applicationTypeOptions = data.applicationTypeOptions;
      });
  }
 
  private loadApplicationsData() {
    this.applicationsService.loadApplications().subscribe({
      next: (applications) => {
        // Convert API data to legacy format for compatibility with existing component
        this.applications = this.applicationsService.convertAllToLegacyFormat();
        this.updateFilteredApplications();
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        // Fallback to mock data if API fails
        this.loadMockApplicationsData();
      }
    });
  }
 
  private loadMockApplicationsData() {
    this.http.get<{applicationTypeOptions: SelectOption[], applications: Application[], applicationStages?: any[]}>('assets/mock-data/applications.json')
      .subscribe(data => {
        this.applications = data.applications;
        this.updateFilteredApplications();
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
    let filtered = this.applicationStatusService.filterApplications(
      this.applications, this.selectedFilter, this.selectedSubStatus
    );
   
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
 
  isSLAViolation(app: Application): boolean {
    if (!app.deadline) return false;
    const today = new Date();
    const deadlineDate = new Date(app.deadline);
    return today > deadlineDate && app.stage !== 'Closed';
  }
 
  hasNotifications(app: Application): boolean {
    // Show notifications for submitted applications, returned applications, or SLA violations
    return app.status === 'Submitted' ||
           app.status === 'Returned' ||
           this.isSLAViolation(app);
  }
 
  navigateToDetail(applicationId: string) {
    this.router.navigate(['/applications', applicationId]);
  }
 
  getApplicationCount = (stage: string) => this.applicationStatusService.getApplicationCount(this.applications, stage);
  isFilterActive = (stage: string) => this.selectedFilter === stage;
  getSubStatuses = (stage: string) => this.applicationStatusService.getSubStatuses(this.applications, stage);
  shouldShowSubStatus = (stage: string) => stage !== 'All' && this.getSubStatuses(stage).length > 0;
 
  toggleView(mode: 'grid' | 'table') {
    this.viewMode = mode;
  }
 
  tableColumns: DataTableColumn[] = [
    { field: 'id', label: 'Application ID', sortable: true, width: '100px' },
    { field: 'companyName', label: 'Company Name', sortable: true },
    { field: 'status', label: 'Status', sortable: true },
    { field: 'categories', label: 'Request', sortable: false, width: '80px' },
    { field: 'progress', label: 'Progress', sortable: true, width: '120px' },
    { field: 'assignee', label: 'Assignee', sortable: true },
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
    return stageName === 'RFQ';
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
    this.navigateToDetail(app.id);
  }
 
  // API-based color and icon methods
  getStageColor(stageName: string): string {
    return this.applicationFiltersService.getStageColor(stageName);
  }
 
  getSubStageColor(subStageName: string): string {
    return this.applicationFiltersService.getSubStageColor(subStageName);
  }
 
  getStageIcon(stageName: string): string {
    return this.applicationFiltersService.getStageIcon(stageName);
  }
 
  getSubStageIcon(subStageName: string): string {
    return this.applicationFiltersService.getSubStageIcon(subStageName);
  }
}