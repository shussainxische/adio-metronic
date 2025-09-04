import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputNumericComponent } from './input-numeric.component';

describe('InputComponent', () => {
  let component: InputNumericComponent;
  let fixture: ComponentFixture<InputNumericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputNumericComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputNumericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
