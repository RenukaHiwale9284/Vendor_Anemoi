import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOperationDialogComponent } from './edit-operation-dialog.component';

describe('EditOperationDialogComponent', () => {
  let component: EditOperationDialogComponent;
  let fixture: ComponentFixture<EditOperationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOperationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOperationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
