import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionTableComponent, AccordionTableRow } from '../../../../../../components/ui/accordion-table/accordion-table.component';

@Component({
  selector: 'app-summary-sub-stage',
  standalone: true,
  imports: [CommonModule, AccordionTableComponent],
  templateUrl: './summary-sub-stage.component.html',
  styleUrl: './summary-sub-stage.component.scss'
})
export class SummarySubStageComponent {
  
  electricTariffData: AccordionTableRow[] = [
    {
      id: 'economic-impact',
      component: 'Economic Impact',
      value: 86,
      weight: '40%',
      score: '34.4',
      isExpandable: true,
      isExpanded: false,
      subRows: [
        { id: 'investment', component: 'Investment', score: 85, weight: '20%', weighted: 17.0 },
        { id: 'investment-top-up', component: 'Investment Top-Up', score: 100, weight: '10%', weighted: 10.0 },
        { id: 'emiratization', component: 'Emiratization', score: 75, weight: '20%', weighted: 15.0 },
        { id: 'emiratization-nos', component: 'Emiratization - No\'s', score: 90, weight: '10%', weighted: 9.0 },
        { id: 'skilled-staff', component: 'Skilled Staff', score: 80, weight: '20%', weighted: 16.0 },
        { id: 'ad-logistics', component: 'AD Logistics', score: 95, weight: '20%', weighted: 19.0 }
      ],
      finalScore: { label: 'Final Economic Impact Score', value: 86, isHighlighted: true }
    },
    {
      id: 'productivity',
      component: 'Productivity',
      value: 92.5,
      weight: '30%',
      score: '27.75',
      isExpandable: true,
      isExpanded: false,
      hideSubHeaders: true,
      subRows: [
        { id: 'value-added', component: 'Value Added', value: '10,000,000 AED' },
        { id: 'average-employees', component: 'Average Employees', value: '108' }
      ],
      finalScore: { label: 'Final Productivity Score', value: '92.5', isHighlighted: true }
    },
    {
      id: 'connection-load',
      component: 'Connection Load',
      value: 'Applicable',
      weight: '15%',
      score: '15.0',
      isExpandable: false
    },
    {
      id: 'ems',
      component: 'EMS',
      value: 'Available',
      weight: '15%',
      score: '15.0',
      isExpandable: false
    }
  ];

  gasTariffData: AccordionTableRow[] = [
    {
      id: 'economic-impact-gas',
      component: 'Economic Impact',
      value: 86,
      weight: '45%',
      score: '38.7',
      isExpandable: true,
      isExpanded: false,
      subRows: [
        { id: 'investment-gas', component: 'Investment', score: 85, weight: '20%', weighted: 17.0 },
        { id: 'investment-top-up-gas', component: 'Investment Top-Up', score: 100, weight: '10%', weighted: 10.0 },
        { id: 'emiratization-gas', component: 'Emiratization', score: 75, weight: '20%', weighted: 15.0 },
        { id: 'emiratization-nos-gas', component: 'Emiratization - No\'s', score: 90, weight: '10%', weighted: 9.0 },
        { id: 'skilled-staff-gas', component: 'Skilled Staff', score: 80, weight: '20%', weighted: 16.0 },
        { id: 'ad-logistics-gas', component: 'AD Logistics', score: 95, weight: '20%', weighted: 19.0 }
      ],
      finalScore: { label: 'Final Economic Impact Score', value: 86, isHighlighted: true }
    },
    {
      id: 'productivity-gas',
      component: 'Productivity',
      value: 92.5,
      weight: '35%',
      score: '32.38',
      isExpandable: true,
      isExpanded: false,
      hideSubHeaders: true,
      subRows: [
        { id: 'value-added-gas', component: 'Value Added', value: '10,000,000 AED' },
        { id: 'average-employees-gas', component: 'Average Employees', value: '108' }
      ],
      finalScore: { label: 'Final Productivity Score', value: '92.5', isHighlighted: true }
    },
    {
      id: 'dms',
      component: 'DMS',
      value: '0%',
      weight: '20%',
      score: '0.0',
      isExpandable: false
    }
  ];
}