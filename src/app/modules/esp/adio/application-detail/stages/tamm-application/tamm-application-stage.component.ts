import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent, TimelineStep } from '../../../../../../../components/ui/timeline/timeline.component';
import { DataTableSimpleComponent, SimpleTableRow } from '../../../../../../../components/ui/data-table-simple/data-table-simple.component';

@Component({
  selector: 'app-tamm-application-stage',
  standalone: true,
  imports: [CommonModule, TimelineComponent, DataTableSimpleComponent],
  templateUrl: './tamm-application-stage.component.html',
  styleUrl: './tamm-application-stage.component.scss'
})
export class TammApplicationStageComponent implements OnChanges {
  @Input() licenseDetails: any = null;
  @Input() companyContact: any = null;
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['licenseDetails'] && this.licenseDetails) {
      this.updateCompanyLicenseData();
    }
    if (changes['companyContact'] && this.companyContact) {
      this.updateCompanyContactData();
    }
  }

  private updateCompanyLicenseData() {
    if (!this.licenseDetails) return;
    
    this.companyLicenseData = [
      { fieldLabel: 'Company Name', labelEn: this.licenseDetails.invCompanyName || 'N/A', labelAr: this.licenseDetails.invCompanyName || 'غير متوفر' },
      { fieldLabel: 'License Type', labelEn: 'Industrial Manufacturing', labelAr: 'التصنيع الصناعي' },
      { fieldLabel: 'Industry Sector', labelEn: this.licenseDetails.invIndustrialType || 'Manufacturing', labelAr: this.licenseDetails.invIndustrialType || 'التصنيع' },
      { fieldLabel: 'License ID', labelEn: this.licenseDetails.invLicenseId?.toString() || 'N/A', labelAr: this.licenseDetails.invLicenseId?.toString() || 'غير متوفر' },
      { fieldLabel: 'License Issue Date', labelEn: this.formatDate(this.licenseDetails.invLicenseIssueDate), labelAr: this.formatDate(this.licenseDetails.invLicenseIssueDate) },
      { fieldLabel: 'License Expiry Date', labelEn: this.formatDate(this.licenseDetails.invLicenseExpiryDate), labelAr: this.formatDate(this.licenseDetails.invLicenseExpiryDate) },
      { fieldLabel: 'Operation Date', labelEn: this.formatDate(this.licenseDetails.invOperationDate), labelAr: this.formatDate(this.licenseDetails.invOperationDate) },
      { fieldLabel: 'Location', labelEn: `${this.licenseDetails.invAddressCity}, ${this.licenseDetails.invAddressEmirate}`, labelAr: `${this.licenseDetails.invAddressCity}, ${this.licenseDetails.invAddressEmirate}` },
      { fieldLabel: 'Address', labelEn: this.licenseDetails.invAddress || 'N/A', labelAr: this.licenseDetails.invAddress || 'غير متوفر' }
    ];
  }

  private updateCompanyContactData() {
    if (!this.companyContact) return;
    
    this.companyContactData = [
      { fieldLabel: 'Contact Name', labelEn: this.companyContact.invFullName || 'N/A', labelAr: this.companyContact.invFullName || 'غير متوفر' },
      { fieldLabel: 'Position', labelEn: this.companyContact.invPosition || 'N/A', labelAr: this.companyContact.invPosition || 'غير متوفر' },
      { fieldLabel: 'Email', labelEn: this.companyContact.invEmail || 'N/A', labelAr: this.companyContact.invEmail || 'غير متوفر' },
      { fieldLabel: 'Phone', labelEn: this.companyContact.invPhone || 'N/A', labelAr: this.companyContact.invPhone || 'غير متوفر' }
    ];
  }

  private formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}