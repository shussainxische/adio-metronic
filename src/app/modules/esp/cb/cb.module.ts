import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EspRoutingModule } from './cb-routing.module';
import { CbComponent } from './cb.component';

@NgModule({
  imports: [
    CommonModule,
    EspRoutingModule,
    CbComponent
  ]
})
export class CBModule { }
