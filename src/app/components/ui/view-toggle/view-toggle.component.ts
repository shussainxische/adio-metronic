import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-view-toggle',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './view-toggle.component.html',
  styleUrl: './view-toggle.component.scss'
})
export class ViewToggleComponent {
  @Input() currentView: 'grid' | 'table' = 'grid';
  @Output() viewChange = new EventEmitter<'grid' | 'table'>();

  toggleView(view: 'grid' | 'table') {
    this.viewChange.emit(view);
  }
}