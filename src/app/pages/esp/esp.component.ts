import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TopCardComponent } from '../../components/ui/top-card/top-card.component';
import { PreviewCardComponent } from '../../components/ui/preview-card/preview-card.component';
import { StatusBadgeComponent, StatusBadgeVariant } from '../../components/ui/status-badge/status-badge.component';

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
  type: string;
  status: 'Pending' | 'Completed';
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
  imports: [CommonModule, TranslateModule, TopCardComponent, PreviewCardComponent, StatusBadgeComponent],
  templateUrl: './esp.component.html',
  styleUrl: './esp.component.scss'
})

export class EspComponent {
  selectedFilter: string = 'All';
  filteredApplications: Application[] = [];

  constructor() {
    console.log('ESP Component initialized!');
    this.filteredApplications = this.applications;
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
    // RFQ Applications
    {
      id: 'ESP-001',
      companyName: 'Al Dhafra Manufacturing',
      companyType: 'Renewal',
      type: 'RFQ',
      status: 'Pending',
      progress: 0,
      date: '1 Jan 2025',
      deadline: '9/15/2025',
      category: 'Electricity',
      certifyingBody: 'Abu Dhabi Certification Body',
      alertState: 'warning',
      slaState: 'none',
      actionLabel: 'Clarifying Body'
    },
    {
      id: 'ESP 1026',
      companyName: 'Green Energy Solutions',
      type: 'RFQ',
      status: 'Pending',
      progress: 25,
      date: '2 Jan 2025',
      actionLabel: 'Under Review'
    },
    {
      id: 'ESP 1027',
      companyName: 'Tech Innovations Ltd',
      type: 'RFQ',
      status: 'Completed',
      progress: 100,
      date: '28 Dec 2024',
      actionLabel: 'View Details'
    },
    // Evaluation Applications
    {
      id: 'ESP 2001',
      companyName: 'Solar Power Corp',
      type: 'Evaluation',
      status: 'Pending',
      progress: 45,
      date: '5 Jan 2025',
      actionLabel: 'Technical Review'
    },
    {
      id: 'ESP 2002',
      companyName: 'Advanced Materials Inc',
      type: 'Evaluation',
      status: 'Completed',
      progress: 85,
      date: '3 Jan 2025',
      actionLabel: 'Final Assessment'
    },
    // Review Applications
    {
      id: 'ESP 3001',
      companyName: 'Industrial Systems Co',
      type: 'Review',
      status: 'Pending',
      progress: 60,
      date: '6 Jan 2025',
      actionLabel: 'Management Review'
    },
    {
      id: 'ESP 3002',
      companyName: 'Logistics Partners LLC',
      type: 'Review',
      status: 'Completed',
      progress: 90,
      date: '4 Jan 2025',
      actionLabel: 'Approve'
    },
    // Closed Applications
    {
      id: 'ESP 4001',
      companyName: 'Completed Project Alpha',
      type: 'Closed',
      status: 'Completed',
      progress: 100,
      date: '20 Dec 2024',
      actionLabel: 'Archive'
    }
  ];

  // Filter applications based on selected type
  filterApplications(type: string) {
    this.selectedFilter = type;
    
    if (type === 'All') {
      this.filteredApplications = this.applications;
    } else {
      this.filteredApplications = this.applications.filter(app => app.type === type);
    }
  }

  // Get count for specific application type
  getApplicationCount(type: string): number {
    if (type === 'All') {
      return this.applications.length;
    }
    return this.applications.filter(app => app.type === type).length;
  }

  // Check if application type is currently selected
  isFilterActive(type: string): boolean {
    return this.selectedFilter === type;
  }

  // Map application status to badge variant
  getStatusVariant(status: string): StatusBadgeVariant {
    const statusMap: { [key: string]: StatusBadgeVariant } = {
      'Pending': 'pending',
      'Completed': 'complete',
      'Active': 'active',
      'Under Review': 'warning',
      'Approved': 'success',
      'Rejected': 'archived'
    };
    return statusMap[status] || 'pending';
  }

  // Map application type to badge variant
  getTypeVariant(type: string): StatusBadgeVariant {
    const typeMap: { [key: string]: StatusBadgeVariant } = {
      'RFQ': 'warning',
      'Evaluation': 'pending', 
      'Review': 'active',
      'Closed': 'success'
    };
    return typeMap[type] || 'pending';
  }

  // Get formatted badge text for type and status
  getBadgeText(type: string, status: string): string {
    return `${type} - ${status}`;
  }
}