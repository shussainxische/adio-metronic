import { Component } from '@angular/core';

@Component({
  selector: 'app-dropdown-wrapper',
  imports: [],
  templateUrl: './dropdown-wrapper.component.html',
  styleUrl: './dropdown-wrapper.component.scss',
  host: {
    class:"shadow-0-1 menu-dropdown menu-default py-3 bg-surface-dropdown-popups broder border-stroke-dropdown-popups"
  }
})
export class DropdownWrapperComponent {

}
