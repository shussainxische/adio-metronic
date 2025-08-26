import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../components/ui/page-header/page-header.component';
import { IconComponent } from '../../components/ui/icon/icon.component';
import { PreviewCardComponent } from '../../components/ui/preview-card/preview-card.component';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageHeaderComponent, IconComponent, PreviewCardComponent],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss'
})
export class ResourcesComponent {
  resources = [
    {
      id: 1,
      title: 'ESP Application Guidelines',
      description: 'Complete guide for Energy Support Program applications',
      type: 'PDF',
      size: '2.5 MB',
      downloadUrl: '/assets/resources/esp-guidelines.pdf',
      category: 'Guidelines',
      icon: 'file-text'
    },
    {
      id: 2,
      title: 'Technical Requirements',
      description: 'Technical specifications and requirements documentation',
      type: 'PDF',
      size: '1.8 MB',
      downloadUrl: '/assets/resources/technical-requirements.pdf',
      category: 'Technical',
      icon: 'settings'
    },
    {
      id: 3,
      title: 'Financial Templates',
      description: 'Excel templates for financial reporting',
      type: 'XLSX',
      size: '0.5 MB',
      downloadUrl: '/assets/resources/financial-templates.xlsx',
      category: 'Templates',
      icon: 'calculator'
    },
    {
      id: 4,
      title: 'Compliance Checklist',
      description: 'Comprehensive checklist for regulatory compliance',
      type: 'PDF',
      size: '1.2 MB',
      downloadUrl: '/assets/resources/compliance-checklist.pdf',
      category: 'Compliance',
      icon: 'check-square'
    },
    {
      id: 5,
      title: 'FAQ Document',
      description: 'Frequently asked questions and answers',
      type: 'PDF',
      size: '0.8 MB',
      downloadUrl: '/assets/resources/faq.pdf',
      category: 'Support',
      icon: 'help-circle'
    },
    {
      id: 6,
      title: 'Video Tutorial',
      description: 'Step-by-step application process walkthrough',
      type: 'Video',
      size: '25 MB',
      downloadUrl: '/assets/resources/tutorial.mp4',
      category: 'Training',
      icon: 'play-circle'
    }
  ];

  categories = [
    { name: 'All', count: this.resources.length },
    { name: 'Guidelines', count: this.resources.filter(r => r.category === 'Guidelines').length },
    { name: 'Technical', count: this.resources.filter(r => r.category === 'Technical').length },
    { name: 'Templates', count: this.resources.filter(r => r.category === 'Templates').length },
    { name: 'Compliance', count: this.resources.filter(r => r.category === 'Compliance').length },
    { name: 'Support', count: this.resources.filter(r => r.category === 'Support').length },
    { name: 'Training', count: this.resources.filter(r => r.category === 'Training').length }
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