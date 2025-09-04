import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageWrapperComponent } from '../../wrappers/page-wrapper/page-wrapper.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

@Component({
  selector: 'app-adio-dashboard',
  standalone: true,
  imports: [CommonModule, PageWrapperComponent, PageHeaderComponent],
  template: `
    <app-page-wrapper>
      <app-page-header 
        title="ADIO Dashboard"
        subtitle="Administrative oversight and system management">
      </app-page-header>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <h2 class="text-xl font-semibold mb-2">ADIO Dashboard</h2>
        <p class="text-gray-600">Welcome to the ADIO administrative dashboard</p>
      </div>
    </app-page-wrapper>
  `
})
export class AdioDashboardComponent {}