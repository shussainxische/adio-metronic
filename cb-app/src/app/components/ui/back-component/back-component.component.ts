import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IconWrapperComponent } from "../icon-wrapper/icon-wrapper.component";
import { CommonModule, Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-back-component',
  imports: [IconWrapperComponent, TranslateModule, CommonModule],
  templateUrl: './back-component.component.html',
  styleUrl: './back-component.component.scss'
})
export class BackComponentComponent {
  @Input() text: string = ''; // Custom text - if empty, will use translation
  @Input() translationKey: string = 'common.back_to_list'; // Custom translation key
  @Input() useCustomHandler: boolean = false; // Explicitly indicate if using custom handler
  @Output() backClick = new EventEmitter<void>(); // Custom click handler

  constructor(private location: Location) {}

  onBackClick(): void {
    if (this.useCustomHandler) {
      // Emit custom event
      this.backClick.emit();
    } else {
      // Default behavior - use browser back
      this.goBack();
    }
  }

  private goBack(): void {
    this.location.back();
  }
}
