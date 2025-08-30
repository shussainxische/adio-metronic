import { Observable } from 'rxjs';

export interface RfqApplicationData {
  licenseDetails: {
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
  };
  companyContact: {
    invFullName: string;
    invEmail: string;
    invPhone: string;
    invPosition: string;
  };
  documents: Array<{
    docFileName: string;
    docFilePath: string;
    docFileSizeMb: number;
    docFileExtension: string;
    docUploadDate: string;
  }>;
  activityLog: Array<{
    logId: number;
    createdOn: string;
    userName: string;
    message: string;
  }>;
}

export interface RfqApplicationResponse {
  appId: number;
  data: RfqApplicationData;
  errors: any[];
  responseTime: string;
  isSuccess: boolean;
}

export interface QuotationSubmissionRequest {
  file: string; // Base64 encoded file
  cbqAmount: number;
  cbId: number;
  appId: number;
}

export interface QuotationSubmissionResponse {
  errors: any[];
  responseTime: string;
  isSuccess: boolean;
}

export abstract class BaseRfqApplicationService {
  abstract getRfqApplication(appId: number): Observable<RfqApplicationResponse>;
  abstract submitQuotation(request: QuotationSubmissionRequest): Observable<QuotationSubmissionResponse>;
}