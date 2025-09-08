import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdioComponent } from './adio.component';

describe('AdioComponent', () => {
  let component: AdioComponent;
  let fixture: ComponentFixture<AdioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
