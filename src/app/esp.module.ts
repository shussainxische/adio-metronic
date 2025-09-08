import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EspRoutingModule } from './esp-routing.module';
import { EspComponent } from './esp/esp.component';

@NgModule({
  imports: [
    CommonModule,
    EspRoutingModule,
    EspComponent
  ]
})
export class EspModule { }
