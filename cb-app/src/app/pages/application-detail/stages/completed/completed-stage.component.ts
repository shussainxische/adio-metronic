import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Application } from '../../../../services/application-status.service';

@Component({
  selector: 'app-completed-stage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './completed-stage.component.html',
  styleUrl: './completed-stage.component.scss'
})
export class CompletedStageComponent {
  @Input() application?: Application;

  downloadCertificate(): void {
    // TODO: Implement certificate download functionality
    console.log('Download certificate clicked');
    
    // For now, just show a message
    alert('Certificate download functionality will be implemented here');
  }
}