import { Injectable } from '@angular/core';
import { StatusBadgeVariant } from '../components/ui/status-badge/status-badge.component';

export interface Application {
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
  assignee: string;
  contactName?: string;
  contactPosition?: string;
  contactEmail?: string;
  contactPhone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationStatusService {
  private readonly statusVariants: Record<string, StatusBadgeVariant> = {
    'Pending': 'pending', 'In Progress': 'pending', 'Initial Review': 'pending',
    'Submitted': 'active', 'Final Review': 'active',
    'Returned': 'warning',
    'Certified': 'success',
    'Not Certified': 'archived', 'Expired': 'archived', 'Canceled': 'archived'
  };

  private readonly closedStatusOrder = ['Certified', 'Not Certified', 'Expired', 'Canceled'];

  getStatusVariant(status: string): StatusBadgeVariant {
    return this.statusVariants[status] || 'pending';
  }

  getBadgeText = (stage: string, status: string) => `${stage} - ${status}`;

  getSubStatuses(applications: Application[], stage: string): string[] {
    if (stage === 'All') return [];
    
    const uniqueStatuses = [...new Set(
      applications.filter(app => app.stage === stage).map(app => app.status)
    )];
    
    return stage === 'Closed' 
      ? uniqueStatuses.sort((a, b) => this.closedStatusOrder.indexOf(a) - this.closedStatusOrder.indexOf(b))
      : uniqueStatuses.sort();
  }

  getSubStatusPillClasses(subStatus: string, isSelected: boolean): string {
    const variant = this.getStatusVariant(subStatus);
    const base = 'border-gray-300 text-gray-700';
    const selectedClass = `bg-status-${variant} text-primary-on-surface2 border-status-${variant}`;
    const hoverClass = `hover:bg-status-${variant} hover:text-primary-on-surface2 hover:border-status-${variant}`;
    
    if (variant === 'archived') {
      return isSelected ? 'bg-gray-400 text-white border-gray-400' : `${base} hover:bg-gray-400 hover:text-white hover:border-gray-400`;
    }
    
    return isSelected ? selectedClass : `${base} ${hoverClass}`;
  }

  getCategoryInitial = (category: string) => 
    ({ 'Electricity': 'E', 'Gas': 'G', 'Water': 'W', 'Energy': 'E', 'Oil': 'O' })[category] || category.charAt(0).toUpperCase();

  getIconForAppType = (appType: string) => 
    ({ 'RFQ': 'file-text', 'Evaluation': 'search', 'Review': 'users', 'Closed': 'archive' })[appType] || 'file-text';

  getApplicationCount = (applications: Application[], stage: string) => 
    stage === 'All' ? applications.length : applications.filter(app => app.stage === stage).length;

  filterApplications(applications: Application[], stage: string, status?: string): Application[] {
    let filtered = stage === 'All' ? applications : applications.filter(app => app.stage === stage);
    return status ? filtered.filter(app => app.status === status) : filtered;
  }


  getApplicationStages = () => [
    { name: 'RFQ', description: 'Request for Quotation applications', icon: 'request_quote', color: 'text-blue-600' },
    { name: 'Evaluation', description: 'Applications under evaluation', icon: 'fact_check', color: 'text-orange-600' },
    { name: 'Review', description: 'Applications in review process', icon: 'rate_review', color: 'text-green-600' },
    { name: 'Closed', description: 'Completed applications', icon: 'check_circle', color: 'text-gray-600' }
  ];

  isClosedAndNotCertified(stage: string, status: string): boolean {
    return stage === 'Closed' && status !== 'Certified';
  }
}