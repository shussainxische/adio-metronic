import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiFileInputComponent } from './multi-file-input.component';

describe('MultiFileInputComponent', () => {
  let component: MultiFileInputComponent;
  let fixture: ComponentFixture<MultiFileInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiFileInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiFileInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
