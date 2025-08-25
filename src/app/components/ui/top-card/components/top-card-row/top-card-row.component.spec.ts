import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopCardRowComponent } from './top-card-row.component';

describe('TopCardRowComponent', () => {
  let component: TopCardRowComponent;
  let fixture: ComponentFixture<TopCardRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopCardRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopCardRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
