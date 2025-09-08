import { Injectable } from '@angular/core';
import { StatusBadgeVariant } from '../components/ui/status-badge/status-badge.component';

export interface Application {
  id: string;
  companyName: string;
  companyType?: string;
  stage: 'Quotation' | 'Evaluation' | 'Review' | 'Closed';
  status: 'Pending' | 'Submitted' | 'In Progress' | 'Returned' | 'Initial Review' | 'External Review' | 'Final Review' | 'Certified' | 'Not Awarded' | 'Cancelled' | 'Rejected' | 'Not Certified';
  progress: number;
  date: string;
  deadline?: string;
  category?: string;
  certifyingBody?: string;
  assignee: string;
  evaluator?: string;
  contactName?: string;
  contactPosition?: string;
  contactEmail?: string;
  contactPhone?: string;
  issueDate?: string;
  expiryDate?: string;
  rejectionReason?: string;
  cancellationReason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationStatusService {
  private readonly statusVariants: Record<string, StatusBadgeVariant> = {
    'Pending': 'pending', 'In Progress': 'pending', 'Initial Review': 'pending',
    'External Review': 'warning',
    'Submitted': 'active', 'Final Review': 'active',
    'Returned': 'warning',
    'Certified': 'success',
    'Not Awarded': 'archived', 'Cancelled': 'archived', 'Rejected': 'archived', 'Not Certified': 'archived'
  };

  private readonly closedStatusOrder = ['Certified', 'Not Certified', 'Not Awarded', 'Rejected', 'Cancelled'];
  private readonly reviewStatusOrder = ['Initial Review', 'External Review', 'Final Review'];

  getStatusVariant(status: string): StatusBadgeVariant {
    return this.statusVariants[status] || 'pending';
  }

  getStatusVariantForAdio(stage: string, status: string, isAdioView: boolean = false): StatusBadgeVariant {
    // For ADIO view, Review stage should be yellow/warning
    if (isAdioView && stage === 'Review') {
      return 'warning';
    }
    return this.getStatusVariant(status);
  }

  getBadgeText = (stage: string, status: string, isAdioView: boolean = false) => {
    // For completed/closed applications with certified status, show "Certified"
    if (stage === 'Completed' && status === 'Certified') {
      return 'Certified';
    }
    
    // For ADIO view, show simplified badge text for Review stage
    if (isAdioView && stage === 'Review') {
      return 'Review';
    }
    
    return `${stage} - ${status}`;
  };

  getSubStatuses(applications: Application[], stage: string, isAdioView: boolean = false): string[] {
    if (stage === 'All') return [];
    
    // For ADIO view, don't show Review sub-statuses
    if (isAdioView && stage === 'Review') {
      return [];
    }
    
    const uniqueStatuses = [...new Set(
      applications.filter(app => app.stage === stage).map(app => app.status)
    )];
    
    let sortedStatuses: string[];
    if (stage === 'Completed' || stage === 'Closed') {
      sortedStatuses = uniqueStatuses.sort((a, b) => this.closedStatusOrder.indexOf(a) - this.closedStatusOrder.indexOf(b));
    } else if (stage === 'Review') {
      sortedStatuses = uniqueStatuses.sort((a, b) => this.reviewStatusOrder.indexOf(a) - this.reviewStatusOrder.indexOf(b));
    } else {
      sortedStatuses = uniqueStatuses.sort();
    }
    
    // Add "All" as the first option for each stage
    return ['All', ...sortedStatuses];
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
    ({ 'Quotation': 'file-text', 'Evaluation': 'search', 'Review': 'users', 'Closed': 'archive' })[appType] || 'file-text';

  getApplicationCount = (applications: Application[], stage: string) => 
    stage === 'All' ? applications.length : applications.filter(app => app.stage === stage).length;

  filterApplications(applications: Application[], stage: string, status?: string): Application[] {
    let filtered = stage === 'All' ? applications : applications.filter(app => app.stage === stage);
    return status ? filtered.filter(app => app.status === status) : filtered;
  }

  consolidateReviewApplicationsForAdio(applications: Application[]): Application[] {
    const otherApps = applications.filter(app => app.stage !== 'Review');
    
    // For ADIO users, show only ONE Review application as example (ESP012 - Final Review)
    const sampleReviewApp = applications.find(app => app.id === 'ESP012');
    
    return sampleReviewApp ? [...otherApps, sampleReviewApp] : otherApps;
  }


  getApplicationStages = () => [
    { name: 'Quotation', description: 'Request for Quotation applications', icon: 'request_quote', color: 'text-blue-600' },
    { name: 'Evaluation', description: 'Applications under evaluation', icon: 'fact_check', color: 'text-orange-600' },
    { name: 'Review', description: 'Applications in review process', icon: 'rate_review', color: 'text-green-600' },
    { name: 'Closed', description: 'Completed applications', icon: 'check_circle', color: 'text-gray-600' }
  ];

  isClosedAndNotCertified(stage: string, status: string): boolean {
    return stage === 'Closed' && status !== 'Certified';
  }

  getClosedStatusText(app: Application): string {
    switch (app.status) {
      case 'Certified':
        return `Issue Date: ${app.issueDate || app.date}\nExpiry Date: ${app.expiryDate || 'N/A'}`;
      case 'Not Awarded':
        const notAwardedReason = app.rejectionReason || 'Quotation Not Approved';
        return `Date: ${app.date}\n${notAwardedReason}`;
      case 'Rejected':
        const rejectionReason = app.rejectionReason || 'Evaluation Rejected';
        return `Date: ${app.date}\n${rejectionReason}`;
      case 'Not Certified':
        const notCertifiedReason = app.rejectionReason || 'Evaluation not approved';
        return `Date: ${app.date}\n${notCertifiedReason}`;
      case 'Cancelled':
        const cancellationReason = app.cancellationReason || 'No response from applicant';
        return `Date: ${app.date}\n${cancellationReason}`;
      default:
        return `${app.status}: ${app.date}`;
    }
  }

  isCertificateExpired(app: Application): boolean {
    if (app.status !== 'Certified' || !app.expiryDate) return false;
    const today = new Date();
    const expiryDate = new Date(app.expiryDate);
    return today > expiryDate;
  }
}