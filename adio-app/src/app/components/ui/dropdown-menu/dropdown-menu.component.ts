import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconWrapperComponent } from '../icon-wrapper/icon-wrapper.component';
import { HasPermissionDirective } from '../../../directives/has-permission/has-permission.directive';
import { DropdownWrapperComponent } from "../../../wrappers/dropdown-wrapper/dropdown-wrapper.component";
import { TranslateModule } from '@ngx-translate/core';

export interface MenuItemConfig {
  id: string;
  label: string;
  icon: string;
  permission?: string[];
  danger?: boolean;
}

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule, IconWrapperComponent, HasPermissionDirective, DropdownWrapperComponent, TranslateModule],
  templateUrl: './dropdown-menu.component.html'
})
export class DropdownMenuComponent {
  @Input() menuItems: MenuItemConfig[] = [];
  @Input() itemId: any = null;
  @Output() itemClick = new EventEmitter<{id: string, itemId: any}>();

  onItemClick(item: MenuItemConfig): void {
    this.itemClick.emit({id: item.id, itemId: this.itemId});
  }
}
