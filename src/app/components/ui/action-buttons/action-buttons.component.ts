import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export type ActionButtonsLayout = 'card-header' | 'card-footer' | 'table';

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './action-buttons.component.html',
  styleUrl: './action-buttons.component.scss'
})
export class ActionButtonsComponent {
  @Input() layout: ActionButtonsLayout = 'table';
  @Input() showSLA: boolean = false;
  @Input() showNotifications: boolean = true; // Always show bell
  @Input() hasNewNotifications: boolean = false; // Show red dot
  @Input() showView: boolean = false;
  
  @Output() slaClick = new EventEmitter<Event>();
  @Output() notificationClick = new EventEmitter<Event>();
  @Output() viewClick = new EventEmitter<Event>();

  onSLAClick(event: Event) {
    event.stopPropagation();
    this.slaClick.emit(event);
  }

  onNotificationClick(event: Event) {
    event.stopPropagation();
    this.notificationClick.emit(event);
  }

  onViewClick(event: Event) {
    event.stopPropagation();
    this.viewClick.emit(event);
  }
}