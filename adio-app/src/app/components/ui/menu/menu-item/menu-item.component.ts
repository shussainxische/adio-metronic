import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxInputComponent } from '../../checkbox-input/checkbox-input.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [CommonModule, CheckboxInputComponent, TranslateModule],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent {
  @Input() selected: boolean = false;
  @Input() checkable: boolean = false;
  @Input() checked: boolean = false;
  @Input() label: string = '';
  @Input() class: string = '';

  @Output() checkChange = new EventEmitter<boolean>();
  @Output() itemClick = new EventEmitter<void>();

  onCheckChange(isChecked: boolean): void {
    this.checked = isChecked;
    this.checkChange.emit(this.checked);
  }

  onClick(event: Event): void {
    event.stopPropagation();

    if (this.checkable) {
      // Toggle the checked state for checkbox mode
      this.checked = !this.checked;
      this.checkChange.emit(this.checked);
    } else {
      // Emit click event for non-checkbox mode
      this.itemClick.emit();
    }
  }
}
