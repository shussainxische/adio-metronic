import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
 
export interface LicenseDetails {
  invId: number;
  invLicenseId: number;
  invCompanyName: string;
  invAddress: string;
  invIndustrialType: string;
  invLicenseIssueDate: string;
  invLicenseExpiryDate: string;
  invOperationDate: string;
  invAddressCity: string;
  invAddressEmirate: string;
}
 
export interface CompanyContact {
  invFullName: string;
  invEmail: string;
  invPhone: string;
  invPosition: string;
}
 
export interface ApplicationDocument {
  docFileName: string;
  docFilePath: string;
  docFileSizeMb: number;
  docFileExtension: string;
  docUploadDate: string;
}
 
export interface ActivityLogEntry {
  logId: number;
  createdOn: string;
  userName: string;
  message: string;
}
 
export interface QuotationApplicationData {
  licenseDetails: LicenseDetails;
  companyContact: CompanyContact;
  documents: ApplicationDocument[];
  activityLog: ActivityLogEntry[];
}
 
export interface QuotationApplicationResponse {
  data: QuotationApplicationData;
  errors: string[];
  responseTime: string;
  isSuccess: boolean;
}
 
@Injectable({
  providedIn: 'root'
})
export class ApplicationDetailService {
  private apiBaseUrl = `${environment.apiBaseUrl}/Application`;
  private applicationDetailSubject = new BehaviorSubject<QuotationApplicationData | null>(null);
 
  constructor(private http: HttpClient) {}
 
  loadApplicationDetail(appId: number): Observable<QuotationApplicationData> {
    const url = `${this.apiBaseUrl}/cb-get-quotation-application?appId=${appId}`;
   
    return this.http.get<QuotationApplicationResponse>(url).pipe(
      map(response => {
        if (response.isSuccess && response.data) {
          this.applicationDetailSubject.next(response.data);
          return response.data;
        }
        throw new Error(`Failed to load application detail: ${response.errors?.join(', ') || 'Unknown error'}`);
      })
    );
  }
 
  getApplicationDetail(): Observable<QuotationApplicationData | null> {
    return this.applicationDetailSubject.asObservable();
  }
 
  getCurrentApplicationDetail(): QuotationApplicationData | null {
    return this.applicationDetailSubject.value;
  }
 
  // Helper methods for accessing specific data
  getLicenseDetails(): LicenseDetails | null {
    const data = this.getCurrentApplicationDetail();
    return data?.licenseDetails || null;
  }
 
  getCompanyContact(): CompanyContact | null {
    const data = this.getCurrentApplicationDetail();
    return data?.companyContact || null;
  }
 
  getDocuments(): ApplicationDocument[] {
    const data = this.getCurrentApplicationDetail();
    return data?.documents || [];
  }
 
  getActivityLog(): ActivityLogEntry[] {
    const data = this.getCurrentApplicationDetail();
    return data?.activityLog || [];
  }
 
  // Utility methods
  getDocumentsByExtension(extension: string): ApplicationDocument[] {
    return this.getDocuments().filter(doc =>
      doc.docFileExtension.toLowerCase() === extension.toLowerCase()
    );
  }
 
  getTotalDocumentSize(): number {
    return this.getDocuments().reduce((total, doc) => total + doc.docFileSizeMb, 0);
  }
 
  getLatestActivityEntry(): ActivityLogEntry | null {
    const activities = this.getActivityLog();
    if (activities.length === 0) return null;
   
    return activities.reduce((latest, current) => {
      const latestDate = new Date(latest.createdOn);
      const currentDate = new Date(current.createdOn);
      return currentDate > latestDate ? current : latest;
    });
  }
 
  formatFileSize(sizeMb: number): string {
    if (sizeMb < 1) {
      return `${Math.round(sizeMb * 1024)} KB`;
    }
    return `${sizeMb.toFixed(1)} MB`;
  }
 
  formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }
 
  formatDateTime(dateString: string): string {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  }
 
  // Convert API data to legacy format for existing component compatibility
  convertToLegacyApplicationFormat(appId: string): any {
    const data = this.getCurrentApplicationDetail();
    if (!data) return null;
 
    const licenseDetails = data.licenseDetails;
    const companyContact = data.companyContact;
 
    return {
      id: appId,
      companyName: licenseDetails.invCompanyName,
      stage: 'RFQ', // Default stage, could be determined by business logic
      status: 'Pending', // Default status
      progress: 0, // Default progress
      date: this.formatDate(licenseDetails.invLicenseIssueDate),
      deadline: this.formatDate(licenseDetails.invLicenseExpiryDate),
      category: this.determineCategoryFromLicense(licenseDetails),
      assignee: 'Certifying Body',
      contactName: companyContact.invFullName,
      contactPosition: companyContact.invPosition,
      contactEmail: companyContact.invEmail,
      contactPhone: companyContact.invPhone,
      // Additional details
      address: licenseDetails.invAddress,
      city: licenseDetails.invAddressCity,
      emirate: licenseDetails.invAddressEmirate,
      licenseId: licenseDetails.invLicenseId,
      industrialType: licenseDetails.invIndustrialType,
      operationDate: this.formatDate(licenseDetails.invOperationDate),
      applicationDate: this.formatDate(licenseDetails.invLicenseIssueDate),
      applicationType: 'Renewal', // Default type
      entityType: licenseDetails.invIndustrialType || 'Manufacturing',
      services: this.determineCategoryFromLicense(licenseDetails).split(', '),
      compliance: 'Pending Review'
    };
  }
 
  private determineCategoryFromLicense(licenseDetails: LicenseDetails): string {
    // Business logic to determine category based on license details
    // This is a placeholder - you might want to implement more sophisticated logic
    const industrialType = licenseDetails.invIndustrialType?.toLowerCase() || '';
   
    if (industrialType.includes('manufacturing')) {
      return 'Electricity, Gas';
    } else if (industrialType.includes('chemical')) {
      return 'Gas';
    } else if (industrialType.includes('steel') || industrialType.includes('aluminum')) {
      return 'Electricity';
    }
   
    // Default to electricity
    return 'Electricity';
  }
 
  // Clear current data (useful for cleanup)
  clearApplicationDetail(): void {
    this.applicationDetailSubject.next(null);
  }
}