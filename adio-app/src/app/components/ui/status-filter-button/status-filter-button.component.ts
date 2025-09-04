import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-filter-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-filter-button.component.html',
  styleUrl: './status-filter-button.component.scss'
})
export class StatusFilterButtonComponent {
  @Input() text: string = '';
  @Input() active: boolean = false;
  @Input() customClasses: string = '';
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}