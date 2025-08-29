import { Injectable } from '@angular/core';
import { Application } from './application-status.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationAssignmentService {
  private readonly externalAssignees = ['Applicant', 'ADIO', 'AD Ports', 'TAQA'];

  isExternalAssignment(app: Application): boolean {
    if ((app.stage === 'RFQ' && app.status === 'Pending') || app.stage === 'Evaluation') {
      return false;
    }
    return this.externalAssignees.includes(app.assignee);
  }

  isLocked(app: Application): boolean {
    return app.stage === 'Closed' || app.status === 'Initial Review' || this.isExternalAssignment(app);
  }
}