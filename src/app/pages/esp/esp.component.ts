import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TopCardComponent } from '../../components/ui/top-card/top-card.component';
import { PreviewCardComponent } from '../../components/ui/preview-card/preview-card.component';
import { PageHeaderComponent } from '../../components/ui/page-header/page-header.component';
import { FilterTabsComponent, FilterTab } from '../../components/ui/filter-tabs/filter-tabs.component';
import { IconComponent } from '../../components/ui/icon/icon.component';
import { StatusBadgeComponent, StatusBadgeVariant } from '../../components/ui/status-badge/status-badge.component';
import { ProgressBarComponent } from '../../components/ui/progress-bar/progress-bar.component';
import { ApplicationFooterComponent } from '../../components/ui/application-footer/application-footer.component';

interface ApplicationType {
  name: string;
  description: string;
  count: number;
  icon: string;
  color: string;
}

interface Application {
  id: string;
  companyName: string;
  companyType?: string;
  stage: 'RFQ' | 'Evaluation' | 'Review' | 'Closed';
  status: 'Pending' | 'Submitted' | 'In Progress' | 'Returned' | 'Initial Review' | 'Final Review' | 'Certified' | 'Not Certified' | 'Expired' | 'Canceled';
  progress: number;
  date: string;
  deadline?: string;
  category?: string;
  certifyingBody?: string;
  alertState?: 'none' | 'warning' | 'critical';
  slaState?: 'none' | 'active' | 'expired';
  actionLabel: string;
}

@Component({
  selector: 'app-esp',
  standalone: true,
  imports: [CommonModule, TranslateModule, TopCardComponent, PreviewCardComponent, PageHeaderComponent, FilterTabsComponent, IconComponent, StatusBadgeComponent, ProgressBarComponent, ApplicationFooterComponent],
  templateUrl: './esp.component.html',
  styleUrl: './esp.component.scss'
})

export class EspComponent {
  selectedFilter: string = 'All';
  selectedSubStatus: string = '';
  filteredApplications: Application[] = [];

  constructor() {
    console.log('ESP Component initialized!');
    this.filteredApplications = this.applications;
  }

  get filterTabs(): FilterTab[] {
    return [
      { key: 'All', label: 'All Applications', count: this.getApplicationCount('All') },
      ...this.applicationTypes.map(type => ({
        key: type.name,
        label: type.name,
        count: this.getApplicationCount(type.name)
      }))
    ];
  }

  get resultCountLabel(): string {
    return `Showing: ${this.filteredApplications.length} applications`;
  }

  applicationTypes: ApplicationType[] = [
    {
      name: 'RFQ',
      description: 'Request for Quotation applications',
      count: 24,
      icon: 'request_quote',
      color: 'text-blue-600'
    },
    {
      name: 'Evaluation',
      description: 'Applications under evaluation',
      count: 18,
      icon: 'fact_check',
      color: 'text-orange-600'
    },
    {
      name: 'Review',
      description: 'Applications in review process',
      count: 12,
      icon: 'rate_review',
      color: 'text-green-600'
    },
    {
      name: 'Closed',
      description: 'Completed applications',
      count: 156,
      icon: 'check_circle',
      color: 'text-gray-600'
    }
  ];

  applications: Application[] = [
    // RFQ Applications - Pending (Yellow)
    {
      id: 'ESP-001',
      companyName: 'Al Dhafra Manufacturing',
      companyType: 'Renewal',
      stage: 'RFQ',
      status: 'Pending',
      progress: 15,
      date: '1 Jan 2025',
      deadline: '9/15/2025',
      category: 'Electricity',
      certifyingBody: 'Abu Dhabi Certification Body',
      alertState: 'warning',
      slaState: 'none',
      actionLabel: 'Clarifying Body'
    },
    // RFQ Applications - Submitted (Blue)
    {
      id: 'ESP 1026',
      companyName: 'Green Energy Solutions',
      stage: 'RFQ',
      status: 'Submitted',
      progress: 35,
      date: '2 Jan 2025',
      actionLabel: 'Under Review'
    },
    
    // Evaluation Applications - In Progress (Yellow)
    {
      id: 'ESP 2001',
      companyName: 'Solar Power Corp',
      stage: 'Evaluation',
      status: 'In Progress',
      progress: 65,
      date: '5 Jan 2025',
      actionLabel: 'Technical Review'
    },
    // Evaluation Applications - Returned (Orange)
    {
      id: 'ESP 2002',
      companyName: 'Advanced Materials Inc',
      stage: 'Evaluation',
      status: 'Returned',
      progress: 40,
      date: '3 Jan 2025',
      actionLabel: 'Requires Updates'
    },
    
    // Review Applications - Initial Review (Blue)
    {
      id: 'ESP 3001',
      companyName: 'Industrial Systems Co',
      stage: 'Review',
      status: 'Initial Review',
      progress: 75,
      date: '6 Jan 2025',
      actionLabel: 'Management Review'
    },
    // Review Applications - Final Review (Blue)
    {
      id: 'ESP 3002',
      companyName: 'Logistics Partners LLC',
      stage: 'Review',
      status: 'Final Review',
      progress: 90,
      date: '4 Jan 2025',
      actionLabel: 'Final Approval'
    },
    
    // Closed Applications - Certified (Green)
    {
      id: 'ESP 4001',
      companyName: 'Certified Company Alpha',
      stage: 'Closed',
      status: 'Certified',
      progress: 100,
      date: '20 Dec 2024',
      actionLabel: 'Certificate Issued'
    },
    // Closed Applications - Not Certified (Red)
    {
      id: 'ESP 4002',
      companyName: 'Rejected Company Beta',
      stage: 'Closed',
      status: 'Not Certified',
      progress: 100,
      date: '18 Dec 2024',
      actionLabel: 'Application Rejected'
    },
    // Closed Applications - Expired (Red)
    {
      id: 'ESP 4003',
      companyName: 'Expired Company Gamma',
      stage: 'Closed',
      status: 'Expired',
      progress: 100,
      date: '15 Dec 2024',
      actionLabel: 'Certificate Expired'
    },
    // Closed Applications - Canceled (Red)
    {
      id: 'ESP 4004',
      companyName: 'Canceled Company Delta',
      stage: 'Closed',
      status: 'Canceled',
      progress: 60,
      date: '12 Dec 2024',
      actionLabel: 'Application Canceled'
    }
  ];

  // Filter applications based on selected stage
  filterApplications(stage: string) {
    this.selectedFilter = stage;
    this.selectedSubStatus = ''; // Reset sub-status when changing stage
    
    if (stage === 'All') {
      this.filteredApplications = this.applications;
    } else {
      this.filteredApplications = this.applications.filter(app => app.stage === stage);
    }
  }

  // Filter applications by sub-status within selected stage
  filterBySubStatus(subStatus: string) {
    this.selectedSubStatus = this.selectedSubStatus === subStatus ? '' : subStatus;
    
    if (this.selectedFilter === 'All') {
      this.filteredApplications = this.applications;
    } else {
      let stageFiltered = this.applications.filter(app => app.stage === this.selectedFilter);
      
      if (this.selectedSubStatus) {
        this.filteredApplications = stageFiltered.filter(app => app.status === this.selectedSubStatus);
      } else {
        this.filteredApplications = stageFiltered;
      }
    }
  }

  // Get count for specific application stage
  getApplicationCount(stage: string): number {
    if (stage === 'All') {
      return this.applications.length;
    }
    return this.applications.filter(app => app.stage === stage).length;
  }

  // Check if application stage is currently selected
  isFilterActive(stage: string): boolean {
    return this.selectedFilter === stage;
  }

  // Map application status to badge variant with proper colors
  getStatusVariant(status: string): StatusBadgeVariant {
    const statusMap: { [key: string]: StatusBadgeVariant } = {
      // RFQ statuses
      'Pending': 'warning',         // Yellow
      'Submitted': 'active',        // Blue
      // Evaluation statuses  
      'In Progress': 'warning',     // Yellow
      'Returned': 'pending',        // Orange
      // Review statuses
      'Initial Review': 'active',   // Blue
      'Final Review': 'active',     // Blue
      // Closed statuses
      'Certified': 'success',       // Green
      'Not Certified': 'archived',  // Red
      'Expired': 'archived',        // Red
      'Canceled': 'archived'        // Red
    };
    return statusMap[status] || 'pending';
  }

  // Get formatted badge text for stage and status
  getBadgeText(stage: string, status: string): string {
    return `${stage} - ${status}`;
  }

  // Get unique sub-statuses for a given stage with custom ordering
  getSubStatuses(stage: string): string[] {
    if (stage === 'All') return [];
    
    const stageApplications = this.applications.filter(app => app.stage === stage);
    const uniqueStatuses = [...new Set(stageApplications.map(app => app.status))];
    
    // Custom ordering for Closed stage - Certified first
    if (stage === 'Closed') {
      const customOrder = ['Certified', 'Not Certified', 'Expired', 'Canceled'];
      return uniqueStatuses.sort((a, b) => {
        const aIndex = customOrder.indexOf(a);
        const bIndex = customOrder.indexOf(b);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return a.localeCompare(b);
      });
    }
    
    return uniqueStatuses.sort();
  }

  // Get CSS classes for sub-status pill buttons using design system colors
  getSubStatusPillClasses(subStatus: string): string {
    const isSelected = this.selectedSubStatus === subStatus;
    
    // Map status to badge variant to get consistent colors
    const variant = this.getStatusVariant(subStatus);
    
    // Use design system colors matching StatusBadgeComponent
    const colorClasses: { [key: string]: string } = {
      'warning': isSelected ? 'bg-status-warning text-primary-on-surface2 border-status-warning' : 'border-status-warning text-primary-on-surface hover:bg-status-warning hover:bg-opacity-10',
      'active': isSelected ? 'bg-status-active text-primary-on-surface2 border-status-active' : 'border-status-active text-primary-on-surface hover:bg-status-active hover:bg-opacity-10',
      'pending': isSelected ? 'bg-status-pending text-primary-on-surface2 border-status-pending' : 'border-status-pending text-primary-on-surface hover:bg-status-pending hover:bg-opacity-10',
      'success': isSelected ? 'bg-status-success text-primary-on-surface2 border-status-success' : 'border-status-success text-primary-on-surface hover:bg-status-success hover:bg-opacity-10',
      'archived': isSelected ? 'bg-status-archived text-primary-on-surface2 border-status-archived' : 'border-status-archived text-primary-on-surface hover:bg-status-archived hover:bg-opacity-10'
    };
    
    return colorClasses[variant] || 'border-gray-300 text-gray-700 hover:bg-gray-50';
  }

  // Get category initial for badge display
  getCategoryInitial(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'Electricity': 'E',
      'Gas': 'G',
      'Water': 'W',
      'Energy': 'E',
      'Oil': 'O'
    };
    return categoryMap[category] || category.charAt(0).toUpperCase();
  }
}