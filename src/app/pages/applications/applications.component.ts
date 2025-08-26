import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

export class ApplicationsComponent {
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

  applicationTypeOptions: SelectOption[] = [
    { label: 'All Types', value: 'all' },
    { label: 'Enrollment', value: 'enrollment' },
    { label: 'Renewal', value: 'renewal' },
    { label: 'New Manufacturing Entity', value: 'new-manufacturing' },
    { label: 'Existing Manufacturing Entity', value: 'existing-manufacturing' }
  ];

  applications: Application[] = [
    { id: 'ESP001', companyName: 'Al Dhafra Manufacturing', companyType: 'renewal', stage: 'RFQ', status: 'Pending', progress: 15, date: '1 Jan 2025', deadline: '1/20/2025', category: 'Electricity,Gas', certifyingBody: 'Abu Dhabi Certification Body', assignee: 'Certifying Body' },
    { id: 'ESP002', companyName: 'Emirates Steel', companyType: 'new-manufacturing', stage: 'RFQ', status: 'Pending', progress: 10, date: '15 Jan 2025', assignee: 'Certifying Body', category: 'Electricity' },
    { id: 'ESP003', companyName: 'Green Energy Solutions', companyType: 'enrollment', stage: 'RFQ', status: 'Submitted', progress: 35, date: '2 Jan 2025', assignee: 'Applicant' },
    { id: 'ESP004', companyName: 'Dubai Manufacturing Co', companyType: 'existing-manufacturing', stage: 'RFQ', status: 'Submitted', progress: 25, date: '10 Jan 2025', assignee: 'Applicant', category: 'Gas' },
    { id: 'ESP005', companyName: 'Solar Power Corp', companyType: 'enrollment', stage: 'Evaluation', status: 'In Progress', progress: 65, date: '5 Jan 2025', assignee: 'Certifying Body', category: 'Gas' },
    { id: 'ESP006', companyName: 'National Industries', companyType: 'renewal', stage: 'Evaluation', status: 'In Progress', progress: 55, date: '12 Jan 2025', assignee: 'Certifying Body', category: 'Electricity,Gas' },
    { id: 'ESP007', companyName: 'Advanced Materials Inc', companyType: 'new-manufacturing', stage: 'Evaluation', status: 'Returned', progress: 40, date: '3 Jan 2025', assignee: 'Certifying Body' },
    { id: 'ESP008', companyName: 'Petrochemicals LLC', companyType: 'existing-manufacturing', stage: 'Evaluation', status: 'Returned', progress: 30, date: '8 Jan 2025', assignee: 'Certifying Body', category: 'Gas' },
    { id: 'ESP009', companyName: 'Industrial Systems Co', companyType: 'enrollment', stage: 'Review', status: 'Initial Review', progress: 75, date: '6 Jan 2025', assignee: 'ADIO' },
    { id: 'ESP010', companyName: 'Maritime Solutions Ltd', companyType: 'renewal', stage: 'Review', status: 'Initial Review', progress: 70, date: '7 Jan 2025', assignee: 'AD Ports' },
    { id: 'ESP011', companyName: 'Energy Infrastructure Co', companyType: 'new-manufacturing', stage: 'Review', status: 'Initial Review', progress: 68, date: '8 Jan 2025', assignee: 'TAQA' },
    { id: 'ESP012', companyName: 'Logistics Partners LLC', companyType: 'existing-manufacturing', stage: 'Review', status: 'Final Review', progress: 90, date: '4 Jan 2025', assignee: 'ADIO' },
    { id: 'ESP013', companyName: 'Certified Company Alpha', companyType: 'enrollment', stage: 'Closed', status: 'Certified', progress: 100, date: '20 Dec 2024', assignee: 'ADIO' },
    { id: 'ESP014', companyName: 'Rejected Company Beta', companyType: 'renewal', stage: 'Closed', status: 'Not Certified', progress: 100, date: '18 Dec 2024', assignee: 'ADIO' },
    { id: 'ESP015', companyName: 'Expired Company Gamma', companyType: 'new-manufacturing', stage: 'Closed', status: 'Expired', progress: 100, date: '15 Dec 2024', assignee: 'ADIO' },
    { id: 'ESP016', companyName: 'Canceled Company Delta', companyType: 'existing-manufacturing', stage: 'Closed', status: 'Canceled', progress: 60, date: '12 Dec 2024', assignee: 'ADIO' }
  ];

  constructor(
    private router: Router,
    public applicationStatusService: ApplicationStatusService,
    public applicationAssignmentService: ApplicationAssignmentService
  ) {
    this.updateFilteredApplications();
  }

  get applicationTypes() {
    return this.applicationStatusService.getApplicationStages();
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
      filtered = filtered.filter(app => app.companyType === this.selectedApplicationType);
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
}