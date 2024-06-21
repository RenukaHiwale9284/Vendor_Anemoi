import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAsDraftDialogComponent } from './save-as-draft-dialog.component';

describe('SaveAsDraftDialogComponent', () => {
  let component: SaveAsDraftDialogComponent;
  let fixture: ComponentFixture<SaveAsDraftDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveAsDraftDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveAsDraftDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
