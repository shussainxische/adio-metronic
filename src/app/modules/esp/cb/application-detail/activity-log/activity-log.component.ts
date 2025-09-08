import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityLogItemComponent } from '@components/ui/_index';
import { ActivityLogGroup } from '@models/esp/_index';

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [CommonModule, ActivityLogItemComponent],
  templateUrl: './activity-log.component.html',
  styleUrl: './activity-log.component.scss'
})
export class ActivityLogComponent {
  
  activityGroups: ActivityLogGroup[] = [
    {
      date: 'Today',
      items: [
        {
          id: '8',
          message: 'Certificate issued and ready for download',
          user: 'System',
          timestamp: '03:45 PM',
          icon: 'award',
          iconColor: 'green'
        }
      ]
    },
    {
      date: 'Yesterday',
      items: [
        {
          id: '6',
          message: 'Multi-entity review initiated',
          user: 'System',
          timestamp: '11:15 AM',
          icon: 'users',
          iconColor: 'blue'
        },
        {
          id: '5',
          message: 'ADIO has completed initial review',
          user: 'ADIO',
          timestamp: '09:00 AM',
          icon: 'search',
          iconColor: 'blue'
        }
      ]
    },
    {
      date: '2 Days Ago',
      items: [
        {
          id: '4',
          message: 'Evaluation submitted',
          user: 'Certifying Body',
          timestamp: '02:15 PM',
          icon: 'clipboard-check',
          iconColor: 'blue'
        },
        {
          id: '3',
          message: 'Quotation approved',
          user: 'Applicant',
          timestamp: '11:30 AM',
          icon: 'thumbs-up',
          iconColor: 'green'
        }
      ]
    },
    {
      date: '3 Days Ago',
      items: [
        {
          id: '2',
          message: 'Quotation submitted for review',
          user: 'Certifying Body',
          timestamp: '10:00 AM',
          icon: 'dollar-sign',
          iconColor: 'blue'
        }
      ]
    },
    {
      date: '4 Days Ago',
      items: [
        {
          id: '1',
          message: 'New Application created',
          user: 'Applicant',
          timestamp: '09:15 AM',
          icon: 'file-plus',
          iconColor: 'yellow'
        }
      ]
    }
  ];
}