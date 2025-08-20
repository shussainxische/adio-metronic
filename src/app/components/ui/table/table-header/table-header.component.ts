import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxInputComponent } from "../../checkbox-input/checkbox-input.component";
import { HasPermissionDirective } from '../../../../directives/has-permission/has-permission.directive';

interface TableRow {
  field?: string;
  label: string;
  sortable?: boolean;
  class?: string;
  onSort?: (field: string) => void;
  permissions?: string | string[];
}

@Component({
  selector: 'app-table-header',
  imports: [CommonModule, TranslateModule, TooltipModule, CheckboxInputComponent, HasPermissionDirective],
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.scss',
  host: {
    class: 'contents',
  },
})
export class TableHeaderComponent {
  @Input() columns: TableRow[];
  @Input() sortColumn: string;
  @Input() sortDirection: 'asc' | 'desc' | '';
  @Input() customHeaders: {[key: string]: TemplateRef<any>} = {};
  @Input() checkboxClass = ''

  // Add checkbox related inputs and outputs
  @Input() showCheckbox: boolean = false;
  @Input() allSelected: boolean = false;
  @Output() headerCheckboxChange = new EventEmitter<Event>();

  @Output() sort = new EventEmitter<string>();
  @ContentChild('headerCheckboxTemplate') headerCheckboxTemplate!: TemplateRef<any>;


  constructor(private translate: TranslateService) { }

  onSort(field: string) {
    this.sort.emit(field);
  }

  getSortTooltip(field: string): string | null {
    if (this.sortColumn !== field) return null;
    return this.sortDirection === 'asc' ? 'Ascending Sort' : 'Descending Sort';
  }

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.headerCheckboxChange.emit(event);
  }

}
