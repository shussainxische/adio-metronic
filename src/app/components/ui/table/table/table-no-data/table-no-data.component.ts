import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AdioButtonComponent } from '../../../adio-button/adio-button.component';
// import { NavigationService } from '../../../../../navigation.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// import { HasPermissionDirective } from '../../../../../directives/has-permission/has-permission.directive';
// import { HasNoPermissionDirective } from '../../../../../directives/has-no-permission/has-no-permission.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-no-data',
  imports: [
    AdioButtonComponent,
    TranslateModule,
    // HasPermissionDirective,
    // HasNoPermissionDirective,
    CommonModule,
  ],
  templateUrl: './table-no-data.component.html',
  styleUrl: './table-no-data.component.scss',
})
export class TableNoDataComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() unauthorizedDescription: string = '';
  @Input() buttonLabel: string = '';
  @Input() permissions: string | string[] = [];
  @Output() buttonClicked = new EventEmitter<void>();

  // constructor(public nav: NavigationService) {}

  onButtonClick() {
    this.buttonClicked.emit();
  }
}
