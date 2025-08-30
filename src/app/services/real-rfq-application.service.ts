import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseRfqApplicationService, RfqApplicationResponse, QuotationSubmissionRequest, QuotationSubmissionResponse } from './base-rfq-application.service';
import { environment } from '../../environments/environment';

@Injectable()
export class RealRfqApplicationService extends BaseRfqApplicationService {
  
  constructor(private http: HttpClient) { 
    super(); 
  }

  getRfqApplication(appId: number): Observable<RfqApplicationResponse> {
    return this.http.get<RfqApplicationResponse>(`${environment.apiBaseUrl}/Application/cb-get-quotation-application?appId=${appId}`);
  }

  submitQuotation(request: QuotationSubmissionRequest): Observable<QuotationSubmissionResponse> {
    return this.http.post<QuotationSubmissionResponse>(`${environment.apiBaseUrl}/Application/cb-post-submit-quotation`, request);
  }
}