import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableToolbarFilerSectionWrapperComponent } from './table-toolbar-filer-section-wrapper.component';

describe('TableToolbarFilerSectionWrapperComponent', () => {
  let component: TableToolbarFilerSectionWrapperComponent;
  let fixture: ComponentFixture<TableToolbarFilerSectionWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableToolbarFilerSectionWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableToolbarFilerSectionWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
