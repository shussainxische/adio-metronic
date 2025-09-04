import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-button.component.html',
  styleUrl: './filter-button.component.scss'
})
export class FilterButtonComponent {
  @Input() label: string = '';
  @Input() active: boolean = false;
  @Input() count?: number;
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}