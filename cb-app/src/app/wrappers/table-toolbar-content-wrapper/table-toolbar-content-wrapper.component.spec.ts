import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableToolbarContentWrapperComponent } from './table-toolbar-content-wrapper.component';

describe('TableToolbarContentWrapperComponent', () => {
  let component: TableToolbarContentWrapperComponent;
  let fixture: ComponentFixture<TableToolbarContentWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableToolbarContentWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableToolbarContentWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
