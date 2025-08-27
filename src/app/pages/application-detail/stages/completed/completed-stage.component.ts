import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-completed-stage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './completed-stage.component.html',
  styleUrl: './completed-stage.component.scss'
})
export class CompletedStageComponent {

  downloadCertificate(): void {
    // TODO: Implement certificate download functionality
    console.log('Download certificate clicked');
    
    // For now, just show a message
    alert('Certificate download functionality will be implemented here');
  }
}