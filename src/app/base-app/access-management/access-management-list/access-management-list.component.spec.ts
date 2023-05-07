import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessManagementListComponent } from './access-management-list.component';

describe('AccessManagementListComponent', () => {
  let component: AccessManagementListComponent;
  let fixture: ComponentFixture<AccessManagementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessManagementListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessManagementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
