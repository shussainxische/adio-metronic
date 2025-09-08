import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../../../components/ui/page-header/page-header.component';
import { IconComponent } from '../../../../../components/ui/icon/icon.component';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageHeaderComponent, IconComponent],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss'
})
export class ResourcesComponent {
  resources = [
    {
      id: 1,
      title: 'Energy Support Program Overview',
      description: 'Comprehensive overview of the ESP program, benefits, and eligibility criteria',
      type: 'PDF',
      size: '1.5 MB',
      downloadUrl: '/assets/resources/esp-overview.pdf',
      category: 'Program Information',
      icon: 'file-text'
    },
    {
      id: 2,
      title: 'Submission Requirements Checklist',
      description: 'Detailed checklist of all required documents and information for ESP applications',
      type: 'DOCX',
      size: '856 KB',
      downloadUrl: '/assets/resources/submission-checklist.docx',
      category: 'Application Guides',
      icon: 'file-text'
    },
    {
      id: 3,
      title: 'Technical Evaluation Criteria',
      description: 'Technical standards and evaluation criteria used by certifying bodies',
      type: 'PDF',
      size: '1.2 MB',
      downloadUrl: '/assets/resources/technical-criteria.pdf',
      category: 'Technical Standards',
      icon: 'file-text'
    }
  ];

  categories = [
    { name: 'All', count: this.resources.length },
    { name: 'Program Information', count: this.resources.filter(r => r.category === 'Program Information').length },
    { name: 'Application Guides', count: this.resources.filter(r => r.category === 'Application Guides').length },
    { name: 'Technical Standards', count: this.resources.filter(r => r.category === 'Technical Standards').length }
  ];

  selectedCategory = 'All';
  filteredResources = [...this.resources];

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredResources = [...this.resources];
    } else {
      this.filteredResources = this.resources.filter(r => r.category === category);
    }
  }

  downloadResource(resource: any) {
    // In a real application, this would trigger a download
    console.log('Downloading:', resource.title);
    // window.open(resource.downloadUrl, '_blank');
  }

  getFileIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'pdf': return 'file-text';
      case 'xlsx': case 'xls': return 'file-spreadsheet';
      case 'video': case 'mp4': return 'play-circle';
      default: return 'file';
    }
  }

  getFileTypeColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'pdf': return 'text-red-600';
      case 'xlsx': case 'xls': return 'text-green-600';
      case 'video': case 'mp4': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  }
}