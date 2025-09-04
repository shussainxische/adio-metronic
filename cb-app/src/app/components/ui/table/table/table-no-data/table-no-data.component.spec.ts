import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableNoDataComponent } from './table-no-data.component';

describe('TableNoDataComponent', () => {
  let component: TableNoDataComponent;
  let fixture: ComponentFixture<TableNoDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableNoDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableNoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
