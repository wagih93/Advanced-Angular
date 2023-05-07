import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManufacturingOrderDialogComponent } from './add-manufacturing-order-dialog.component';

describe('AddManufacturingOrderDialogComponent', () => {
  let component: AddManufacturingOrderDialogComponent;
  let fixture: ComponentFixture<AddManufacturingOrderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddManufacturingOrderDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddManufacturingOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
