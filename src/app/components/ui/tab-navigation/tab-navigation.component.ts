import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasPermissionDirective } from '../../../directives/has-permission/has-permission.directive';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '../icon/icon.component';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  count?: number;
  permissions?: string | string[];
}

@Component({
  selector: 'app-tab-navigation',
  standalone: true,
  imports: [CommonModule, HasPermissionDirective, TranslateModule, IconComponent],
  templateUrl: './tab-navigation.component.html',
  styleUrl: './tab-navigation.component.scss',
})
export class TabNavigationComponent {
  @Input() tabs: Tab[] = [];
  @Input() activeTabId: string = '';
  @Input() class: string = '';
  @Output() tabSelected = new EventEmitter<string>();

  selectTab(tabId: string): void {
    this.activeTabId = tabId;
    this.tabSelected.emit(tabId);
  }
}
