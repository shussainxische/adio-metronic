import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupSelectComponent } from './lookup-select.component';

describe('LookupSelectComponent', () => {
  let component: LookupSelectComponent;
  let fixture: ComponentFixture<LookupSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookupSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookupSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
