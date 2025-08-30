import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { BaseRfqApplicationService, RfqApplicationResponse, QuotationSubmissionRequest, QuotationSubmissionResponse } from './base-rfq-application.service';

@Injectable()
export class MockRfqApplicationService extends BaseRfqApplicationService {
  
  constructor() { 
    super(); 
  }

  getRfqApplication(appId: number): Observable<RfqApplicationResponse> {
    const mockData = this.getMockData();
    const application = mockData.find(app => app.appId === appId);
    
    if (application) {
      return of(application);
    } else {
      return of({
        appId: appId,
        data: {
          licenseDetails: {
            invId: 0,
            invLicenseId: 0,
            invCompanyName: "",
            invAddress: "",
            invIndustrialType: "",
            invLicenseIssueDate: "",
            invLicenseExpiryDate: "",
            invOperationDate: "",
            invAddressCity: "",
            invAddressEmirate: ""
          },
          companyContact: {
            invFullName: "",
            invEmail: "",
            invPhone: "",
            invPosition: ""
          },
          documents: [],
          activityLog: []
        },
        errors: ["Application not found"],
        responseTime: new Date().toISOString(),
        isSuccess: false
      });
    }
  }

  private getMockData(): RfqApplicationResponse[] {
    return [
      {
        appId: 1,
        data: {
          licenseDetails: {
            invId: 1,
            invLicenseId: 1,
            invCompanyName: "Al Dhafra Manufacturing LLC",
            invAddress: "Industrial Area, Abu Dhabi",
            invIndustrialType: "",
            invLicenseIssueDate: "2020-01-01T00:00:00",
            invLicenseExpiryDate: "2025-12-31T00:00:00",
            invOperationDate: "2018-01-01T00:00:00",
            invAddressCity: "Abu Dhabi",
            invAddressEmirate: "Abu Dhabi"
          },
          companyContact: {
            invFullName: "Ahmed Al Rashid",
            invEmail: "ahmed@aldhafra.ae",
            invPhone: "+971 50 123 4567",
            invPosition: "Managing Director"
          },
          documents: [],
          activityLog: [
            {
              logId: 1,
              createdOn: "2025-08-28T13:46:43Z",
              userName: "Ahmed Al Rashid",
              message: "Application ESP-001 created and moved to RFQ - Pending stage. Initial application submission by Al Dhafra Manufacturing LLC"
            }
          ]
        },
        errors: [],
        responseTime: "2025-08-29T15:59:52.960667+04:00",
        isSuccess: true
      },
      {
        appId: 2,
        data: {
          licenseDetails: {
            invId: 2,
            invLicenseId: 2,
            invCompanyName: "Abu Dhabi Plastics Co.",
            invAddress: "Industrial Zone 2, Abu Dhabi",
            invIndustrialType: "",
            invLicenseIssueDate: "2019-03-15T00:00:00",
            invLicenseExpiryDate: "2024-03-14T00:00:00",
            invOperationDate: "2019-03-15T00:00:00",
            invAddressCity: "Abu Dhabi",
            invAddressEmirate: "Abu Dhabi"
          },
          companyContact: {
            invFullName: "Sara Mohammed",
            invEmail: "sara@adplastics.ae",
            invPhone: "+971 55 234 5678",
            invPosition: "General Manager"
          },
          documents: [],
          activityLog: [
            {
              logId: 2,
              createdOn: "2025-08-28T13:46:43Z",
              userName: "Sara Mohammed",
              message: "Application ESP-002 created and moved to RFQ - Pending stage. Initial application submission by Abu Dhabi Plastics Co."
            }
          ]
        },
        errors: [],
        responseTime: "2025-08-29T23:08:17.9209426+04:00",
        isSuccess: true
      },
      {
        appId: 3,
        data: {
          licenseDetails: {
            invId: 3,
            invLicenseId: 3,
            invCompanyName: "Ruwais Industrial",
            invAddress: "Ruwais Industrial Complex",
            invIndustrialType: "",
            invLicenseIssueDate: "2020-06-01T00:00:00",
            invLicenseExpiryDate: "2025-05-31T00:00:00",
            invOperationDate: "2020-06-01T00:00:00",
            invAddressCity: "Ruwais",
            invAddressEmirate: "Abu Dhabi"
          },
          companyContact: {
            invFullName: "Khalid Hassan",
            invEmail: "khalid@ruwais.ae",
            invPhone: "+971 56 345 6789",
            invPosition: "CEO"
          },
          documents: [],
          activityLog: [
            {
              logId: 3,
              createdOn: "2025-08-28T13:46:43Z",
              userName: "Khalid Hassan",
              message: "Application ESP-003 created and moved to RFQ - Pending stage. Initial application submission by Ruwais Industrial"
            }
          ]
        },
        errors: [],
        responseTime: "2025-08-29T23:08:17.9209426+04:00",
        isSuccess: true
      },
      {
        appId: 4,
        data: {
          licenseDetails: {
            invId: 3,
            invLicenseId: 3,
            invCompanyName: "Ruwais Industrial",
            invAddress: "Ruwais Industrial Complex",
            invIndustrialType: "",
            invLicenseIssueDate: "2020-06-01T00:00:00",
            invLicenseExpiryDate: "2025-05-31T00:00:00",
            invOperationDate: "2020-06-01T00:00:00",
            invAddressCity: "Ruwais",
            invAddressEmirate: "Abu Dhabi"
          },
          companyContact: {
            invFullName: "Khalid Hassan",
            invEmail: "khalid@ruwais.ae",
            invPhone: "+971 56 345 6789",
            invPosition: "CEO"
          },
          documents: [
            {
              docFileName: "Al_Dhafra_Trade_License.pdf",
              docFilePath: "/documents/app1/trade_license.pdf",
              docFileSizeMb: 2.3,
              docFileExtension: "pdf",
              docUploadDate: "2025-08-15T10:18:05Z"
            }
          ],
          activityLog: []
        },
        errors: [],
        responseTime: "2025-08-29T23:08:17.9209426+04:00",
        isSuccess: true
      },
      {
        appId: 5,
        data: {
          licenseDetails: {
            invId: 3,
            invLicenseId: 3,
            invCompanyName: "Ruwais Industrial",
            invAddress: "Ruwais Industrial Complex",
            invIndustrialType: "",
            invLicenseIssueDate: "2020-06-01T00:00:00",
            invLicenseExpiryDate: "2025-05-31T00:00:00",
            invOperationDate: "2020-06-01T00:00:00",
            invAddressCity: "Ruwais",
            invAddressEmirate: "Abu Dhabi"
          },
          companyContact: {
            invFullName: "Khalid Hassan",
            invEmail: "khalid@ruwais.ae",
            invPhone: "+971 56 345 6789",
            invPosition: "CEO"
          },
          documents: [
            {
              docFileName: "Al_Dhafra_Financial_2024.pdf",
              docFilePath: "/documents/app1/financial_statement_2024.pdf",
              docFileSizeMb: 1.5,
              docFileExtension: "pdf",
              docUploadDate: "2025-08-15T10:18:05Z"
            }
          ],
          activityLog: []
        },
        errors: [],
        responseTime: "2025-08-29T23:08:17.9209426+04:00",
        isSuccess: true
      },
      {
        appId: 6,
        data: {
          licenseDetails: {
            invId: 3,
            invLicenseId: 3,
            invCompanyName: "Ruwais Industrial",
            invAddress: "Ruwais Industrial Complex",
            invIndustrialType: "",
            invLicenseIssueDate: "2020-06-01T00:00:00",
            invLicenseExpiryDate: "2025-05-31T00:00:00",
            invOperationDate: "2020-06-01T00:00:00",
            invAddressCity: "Ruwais",
            invAddressEmirate: "Abu Dhabi"
          },
          companyContact: {
            invFullName: "Khalid Hassan",
            invEmail: "khalid@ruwais.ae",
            invPhone: "+971 56 345 6789",
            invPosition: "CEO"
          },
          documents: [
            {
              docFileName: "Abu_Dhabi_Plastics_Tech_Specs.pdf",
              docFilePath: "/documents/app2/tech_specs.pdf",
              docFileSizeMb: 4.2,
              docFileExtension: "pdf",
              docUploadDate: "2025-08-18T10:18:05Z"
            }
          ],
          activityLog: []
        },
        errors: [],
        responseTime: "2025-08-29T23:08:17.9209426+04:00",
        isSuccess: true
      },
      {
        appId: 7,
        data: {
          licenseDetails: {
            invId: 4,
            invLicenseId: 4,
            invCompanyName: "Ruwais Industrial",
            invAddress: "Ruwais Industrial Complex",
            invIndustrialType: "Chemical Processing",
            invLicenseIssueDate: "2020-06-01T00:00:00",
            invLicenseExpiryDate: "2025-05-31T00:00:00",
            invOperationDate: "2020-06-01T00:00:00",
            invAddressCity: "Ruwais",
            invAddressEmirate: "Abu Dhabi"
          },
          companyContact: {
            invFullName: "Khalid Hassan",
            invEmail: "khalid@ruwais.ae",
            invPhone: "+971 56 345 6789",
            invPosition: "CEO"
          },
          documents: [
            {
              docFileName: "Evaluation_Documents.pdf",
              docFilePath: "/documents/app7/evaluation_docs.pdf",
              docFileSizeMb: 3.1,
              docFileExtension: "pdf",
              docUploadDate: "2025-08-20T10:18:05Z"
            }
          ],
          activityLog: [
            {
              logId: 7,
              createdOn: "2025-08-20T13:46:43Z",
              userName: "System",
              message: "Application ESP-007 moved to Evaluation - In Progress stage. Quotation approved and evaluation started."
            }
          ]
        },
        errors: [],
        responseTime: "2025-08-29T23:08:17.9209426+04:00",
        isSuccess: true
      },
      {
        appId: 8,
        data: {
          licenseDetails: {
            invId: 4,
            invLicenseId: 4,
            invCompanyName: "Ruwais Industrial",
            invAddress: "Ruwais Industrial Complex",
            invIndustrialType: "Chemical Processing",
            invLicenseIssueDate: "2020-06-01T00:00:00",
            invLicenseExpiryDate: "2025-05-31T00:00:00",
            invOperationDate: "2020-06-01T00:00:00",
            invAddressCity: "Ruwais",
            invAddressEmirate: "Abu Dhabi"
          },
          companyContact: {
            invFullName: "Khalid Hassan",
            invEmail: "khalid@ruwais.ae",
            invPhone: "+971 56 345 6789",
            invPosition: "CEO"
          },
          documents: [
            {
              docFileName: "Evaluation_Documents.pdf",
              docFilePath: "/documents/app8/evaluation_docs.pdf",
              docFileSizeMb: 3.1,
              docFileExtension: "pdf",
              docUploadDate: "2025-08-20T10:18:05Z"
            }
          ],
          activityLog: [
            {
              logId: 8,
              createdOn: "2025-08-20T13:46:43Z",
              userName: "System",
              message: "Application ESP-008 moved to Evaluation - In Progress stage. Quotation approved and evaluation started."
            }
          ]
        },
        errors: [],
        responseTime: "2025-08-29T23:08:17.9209426+04:00",
        isSuccess: true
      }
    ];
  }

  submitQuotation(request: QuotationSubmissionRequest): Observable<QuotationSubmissionResponse> {
    // Simulate API delay
    return of({
      errors: [],
      responseTime: new Date().toISOString(),
      isSuccess: true
    }).pipe(delay(1000)); // Simulate network delay
  }
}