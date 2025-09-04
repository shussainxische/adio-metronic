import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdioButtonComponent } from '../../adio-button/adio-button.component';

@Component({
  selector: 'app-popup-dialog',
  imports: [CommonModule, AdioButtonComponent],
  templateUrl: './popup-dialog.component.html',
  styleUrl: './popup-dialog.component.scss'
})

export class PopupDialogComponent {
  @Input() iconType: 'error' | 'success' | 'trash' | 'info' | 'exclamation' | undefined;
  @Input() title: string = '';
  @Input() description?: string;
  @Input() primaryButtonText: string = 'OK';
  @Input() secondaryButtonText?: string;
  @Input() variant: 'primary' | 'secondary' | 'delete' | 'success' | 'info' | 'warning' = 'primary';
  @Input() primaryButtonClass: string = '';
  @Input() secondaryButtonClass?: string;


  @Output() primaryAction = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();

  onPrimaryClick() {
    this.primaryAction.emit();
  }

  onSecondaryClick() {
    this.secondaryAction.emit();
  }
}
