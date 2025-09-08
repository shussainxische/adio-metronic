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
import { CompactSearchComponent } from './compact-search/compact-search.component';


@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, TopCardComponent, PreviewCardComponent, PageHeaderComponent, IconComponent, StatusBadgeComponent, ProgressBarComponent, FilterButtonComponent, ViewToggleComponent, SelectDropdownComponent, StatsCardComponent, StatusFilterButtonComponent, AssigneeInfoComponent, TablePaginationComponent, ActionButtonsComponent, DataTableComponent, CompactSearchComponent],
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
  isAdioView: boolean = false;
  
  // Pagination properties
  currentPage: number = 1;
  perPage: number = 12; // 12 items per page for grid view (3x4 grid)
  totalItems: number = 0;

  applicationTypeOptions: SelectOption[] = [];

  applications: Application[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    public applicationStatusService: ApplicationStatusService,
    public applicationAssignmentService: ApplicationAssignmentService
  ) {}

  ngOnInit() {
    // Detect if we're in ADIO view based on URL
    this.isAdioView = this.router.url.startsWith('/adio');
    this.loadApplicationsData();
  }

  private loadApplicationsData() {
    this.http.get<{applicationTypeOptions: SelectOption[], applications: Application[], applicationStages?: any[]}>('assets/mock-data/applications.json')
      .subscribe(data => {
        this.applicationTypeOptions = data.applicationTypeOptions;
        // For ADIO view, consolidate Review applications to show one per company
        this.applications = this.isAdioView ? 
          this.applicationStatusService.consolidateReviewApplicationsForAdio(data.applications) :
          data.applications;
        this.updateFilteredApplications();
      });
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
    if (subStatus === 'All') {
      this.selectedSubStatus = '';
    } else {
      // Prevent selecting "Not Awarded" or "Rejected" for ADIO users
      if (this.isAdioView && (subStatus === 'Not Awarded' || subStatus === 'Rejected')) {
        return;
      }
      this.selectedSubStatus = this.selectedSubStatus === subStatus ? '' : subStatus;
    }
    this.updateFilteredApplications();
  }

  private updateFilteredApplications() {
    // First apply stage and sub-status filtering
    let filtered = this.applicationStatusService.filterApplications(
      this.applications, this.selectedFilter, this.selectedSubStatus
    );
    
    // Remove "Not Awarded" and "Rejected" applications for ADIO users
    if (this.isAdioView) {
      filtered = filtered.filter(app => app.status !== 'Not Awarded' && app.status !== 'Rejected');
    }
    
    // Then apply application type filtering
    if (this.selectedApplicationType !== 'all') {
      filtered = filtered.filter(app => app.companyType === this.selectedApplicationType);
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

  navigateToDetail(applicationId: string, app?: Application) {
    const role = sessionStorage.getItem('selectedRole') || 'cb';
    const rolePrefix = role === 'adio' ? '/adio' : '/cb';
    
    // Check if stage is "Quotation" with "Pending" status and navigate to Quotation stage
    if (app?.stage === 'Quotation' && app?.status === 'Pending') {
      this.router.navigate([rolePrefix + '/applications', applicationId], {
        queryParams: { stage: 'Quotation', step: '0' }
      });
    }
    // For ADIO users, Review applications should go directly to Final Review tab (step 2)
    else if (this.isAdioView && app?.stage === 'Review') {
      this.router.navigate([rolePrefix + '/applications', applicationId], {
        queryParams: { stage: 'Review', step: '2' }
      });
    }
    else {
      this.router.navigate([rolePrefix + '/applications', applicationId]);
    }
  }

  getCardClasses(app: Application): string {
    // ADIO view logic takes priority
    if (this.isAdioView) {
      // Closed applications maintain their normal styling
      if (app.stage === 'Closed') {
        return this.applicationAssignmentService.isLocked(app, this.isAdioView) ? 'border-transparent bg-gray-50' : '';
      }
      
      // Quotation Submitted and External Review should be grey
      if ((app.stage === 'Quotation' && app.status === 'Submitted') || 
          app.status === 'External Review') {
        return 'border-transparent bg-gray-50';
      }
      
      // External/other entity assignees get grey background (same as locked applications)
      if (app.assignee && 
          app.assignee !== 'ADIO' && 
          (app.assignee.toLowerCase().includes('body') || 
           app.assignee.toLowerCase().includes('external') ||
           app.assignee.toLowerCase().includes('third party') ||
           app.assignee === 'Certifying Body')) {
        return 'border-transparent bg-gray-50';
      }
      
      // ADIO assigned applications get white background (default)
      return 'bg-white';
    }
    
    // CB view or default logic
    return this.applicationAssignmentService.isLocked(app, this.isAdioView) ? 'border-transparent bg-gray-50' : '';
  }

  getAdioCardClasses(app: any): string {
    if (!this.isAdioView) {
      return '';
    }
    
    // Closed applications maintain their normal styling
    if (app.status === 'Closed' || app.stage === 'Closed') {
      return '';
    }
    
    // Initial Review and Final Review statuses should always be white in ADIO view
    if (app.status === 'Initial Review' || app.status === 'Final Review') {
      return 'bg-white';
    }
    
    // External/other entity assignees get grey background (same as locked applications)
    if (app.assignee && 
        app.assignee !== 'ADIO' && 
        (app.assignee.toLowerCase().includes('body') || 
         app.assignee.toLowerCase().includes('external') ||
         app.assignee.toLowerCase().includes('third party') ||
         app.assignee === 'Certifying Body')) {
      return 'border-transparent bg-gray-50';
    }
    
    // ADIO assigned applications get white background (default)
    return 'bg-white';
  }

  getApplicationCount = (stage: string) => {
    let apps = this.applications;
    // Remove "Not Awarded" and "Rejected" applications for ADIO users
    if (this.isAdioView) {
      apps = apps.filter(app => app.status !== 'Not Awarded' && app.status !== 'Rejected');
    }
    return this.applicationStatusService.getApplicationCount(apps, stage);
  };
  isFilterActive = (stage: string) => this.selectedFilter === stage;
  getSubStatuses = (stage: string) => {
    let apps = this.applications;
    // Remove "Not Awarded" and "Rejected" applications for ADIO users
    if (this.isAdioView) {
      apps = apps.filter(app => app.status !== 'Not Awarded' && app.status !== 'Rejected');
    }
    return this.applicationStatusService.getSubStatuses(apps, stage, this.isAdioView);
  };
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
    return this.applicationAssignmentService.isLocked(app, this.isAdioView) ? 'locked' : '';
  };

  onTableRowClick(app: Application) {
    if (app.status === 'Cancelled') {
      return; // Prevent navigation for cancelled applications
    }
    this.navigateToDetail(app.id);
  }

  onCardClick(app: Application) {
    if (app.status === 'Cancelled') {
      return; // Prevent navigation for cancelled applications
    }
    this.navigateToDetail(app.id, app);
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
      case 'Not Certified':
        return app.rejectionReason || 'Evaluation not approved';
      case 'Cancelled':
        return app.cancellationReason || 'No response from applicant';
      default:
        return '';
    }
  }
}