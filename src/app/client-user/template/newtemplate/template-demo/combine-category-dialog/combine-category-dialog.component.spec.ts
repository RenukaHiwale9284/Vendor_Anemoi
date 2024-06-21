import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombineCategoryDialogComponent } from './combine-category-dialog.component';

describe('CombineCategoryDialogComponent', () => {
  let component: CombineCategoryDialogComponent;
  let fixture: ComponentFixture<CombineCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombineCategoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CombineCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
