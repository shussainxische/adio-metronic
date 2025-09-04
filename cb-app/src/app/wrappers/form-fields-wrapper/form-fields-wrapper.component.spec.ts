import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldsWrapperComponent } from './form-fields-wrapper.component';

describe('FormFieldsWrapperComponent', () => {
  let component: FormFieldsWrapperComponent;
  let fixture: ComponentFixture<FormFieldsWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldsWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFieldsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
