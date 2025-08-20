import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface SnackbarAction {
  label: string;
  id: string;
  callback?: () => void;
}

@Component({
  selector: 'app-snackbar',
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent {
  @Input() message: string = '';
  @Input() subMessage: string = '';
  @Input() actions: SnackbarAction[] = [];
  @Input() icon?: 'success' | 'error' | 'warning' | 'info' | string;
  @Output() actionTriggered = new EventEmitter<string>();

  onActionClick(actionId: string) {
    this.actionTriggered.emit(actionId);
  }
}
