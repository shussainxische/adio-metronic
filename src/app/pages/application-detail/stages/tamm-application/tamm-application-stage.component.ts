import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent, TimelineStep } from '../../../../components/ui/timeline/timeline.component';
import { DataTableSimpleComponent, SimpleTableRow } from '../../../../components/ui/data-table-simple/data-table-simple.component';

@Component({
  selector: 'app-tamm-application-stage',
  standalone: true,
  imports: [CommonModule, TimelineComponent, DataTableSimpleComponent],
  templateUrl: './tamm-application-stage.component.html',
  styleUrl: './tamm-application-stage.component.scss'
})
export class TammApplicationStageComponent {
  timelineData: TimelineStep[] = [
    {
      id: 'ruwad',
      title: 'Ruwad',
      description: 'Initial planning and approval phase',
      startDate: '2020-01-01',
      endDate: '2021-12-31',
      status: 'completed',
      color: 'green'
    },
    {
      id: 'construction',
      title: 'Under Construction',
      description: 'Infrastructure development and construction phase',
      startDate: '2022-01-01',
      endDate: null,
      status: 'active',
      color: 'yellow'
    },
    {
      id: 'production',
      title: 'Production',
      description: 'Operational phase - awaiting construction completion',
      startDate: '2024-01-01',
      endDate: null,
      status: 'pending',
      color: 'gray'
    }
  ];

  companyLicenseData: SimpleTableRow[] = [
    { fieldLabel: 'Company Name', labelEn: 'Al Dhafra Manufacturing Complex', labelAr: 'مجمع الظفرة للتصنيع' },
    { fieldLabel: 'License Type', labelEn: 'Industrial Manufacturing', labelAr: 'التصنيع الصناعي' },
    { fieldLabel: 'Industry Sector', labelEn: 'Renewable Energy Equipment', labelAr: 'معدات الطاقة المتجددة' },
    { fieldLabel: 'Investment Value', labelEn: 'AED 2.5 Billion', labelAr: '٢.٥ مليار درهم' },
    { fieldLabel: 'Employment Capacity', labelEn: '850 Jobs', labelAr: '٨٥٠ وظيفة' },
    { fieldLabel: 'Location', labelEn: 'Khalifa Industrial Zone Abu Dhabi (KIZAD)', labelAr: 'المنطقة الصناعية خليفة أبوظبي (كيزاد)' },
    { fieldLabel: 'License Number', labelEn: 'CN-2157841', labelAr: 'CN-2157841' },
    { fieldLabel: 'License Status', labelEn: 'Active', labelAr: 'نشط' }
  ];

  companyContactData: SimpleTableRow[] = [
    { fieldLabel: 'Contact Name', labelEn: 'Ahmed Mohammed Al Rashid', labelAr: 'أحمد محمد الراشد' },
    { fieldLabel: 'Position', labelEn: 'Chief Executive Officer', labelAr: 'الرئيس التنفيذي' },
    { fieldLabel: 'Email', labelEn: 'ahmed.rashid@aldhafra.ae', labelAr: 'ahmed.rashid@aldhafra.ae' },
    { fieldLabel: 'Office Phone', labelEn: '+971 2 123 4567', labelAr: '+971 2 123 4567' },
    { fieldLabel: 'Mobile Phone', labelEn: '+971 50 987 6543', labelAr: '+971 50 987 6543' },
    { fieldLabel: 'Address', labelEn: 'P.O. Box 12345, Abu Dhabi, UAE', labelAr: 'ص.ب ١٢٣٤٥، أبوظبي، الإمارات العربية المتحدة' }
  ];
}