import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdioLogoComponent } from './adio-logo.component';

describe('AdioLogoComponent', () => {
  let component: AdioLogoComponent;
  let fixture: ComponentFixture<AdioLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdioLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdioLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
