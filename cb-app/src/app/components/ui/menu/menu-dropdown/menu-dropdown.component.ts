import { Component, Input, ContentChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'left-start' | 'right-start';
type MenuTrigger = 'click' | 'hover' | 'click|lg:click' | 'click|lg:hover';

@Component({
  selector: 'app-menu-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-dropdown.component.html',
  styleUrls: ['./menu-dropdown.component.scss'],
})
export class MenuDropdownComponent implements AfterViewInit {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() icon: string = '';
  @Input() placement: MenuPlacement = 'bottom-start';
  @Input() placementRtl: MenuPlacement = 'bottom-end';
  @Input() trigger: MenuTrigger = 'click|lg:click';
  @Input() offset: string = '0, 10px';
  @Input() width: string = 'w-full max-w-56';
  @Input() padding: string = 'p-4';
  @Input() showIcon: boolean = true;
  @Input() boxed: boolean = false;

  ngAfterViewInit() {
    // Re-initialize Metronic's menu component if needed
    if (typeof (window as any).KTMenu !== 'undefined') {
      // This may need to be adjusted based on Metronic's exact API
      (window as any).KTMenu.createInstances();
    }
  }
}
