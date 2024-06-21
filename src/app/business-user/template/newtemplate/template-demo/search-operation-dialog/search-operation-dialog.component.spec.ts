import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchOperationDialogComponent } from './search-operation-dialog.component';

describe('SearchOperationDialogComponent', () => {
  let component: SearchOperationDialogComponent;
  let fixture: ComponentFixture<SearchOperationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchOperationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchOperationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
