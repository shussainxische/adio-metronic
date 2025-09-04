import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-select-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-dropdown.component.html',
  styleUrl: './select-dropdown.component.scss'
})
export class SelectDropdownComponent {
  @Input() label: string = '';
  @Input() options: SelectOption[] = [];
  @Input() selectedValue: string = '';
  @Output() selectionChange = new EventEmitter<string>();

  onSelectionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectionChange.emit(target.value);
  }
}