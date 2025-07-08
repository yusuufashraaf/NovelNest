import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUpdate } from './dashboard-update';

describe('DashboardUpdate', () => {
  let component: DashboardUpdate;
  let fixture: ComponentFixture<DashboardUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
