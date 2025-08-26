import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss'
})
export class StatsCardComponent {
  @Input() title: string = '';
  @Input() count: number = 0;
  @Input() icon: string = '';
  @Input() showAlert: boolean = false;
  @Input() alertText: string = '';
}