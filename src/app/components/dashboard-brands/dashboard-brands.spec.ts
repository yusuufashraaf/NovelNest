import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBrands } from './dashboard-brands';

describe('DashboardBrands', () => {
  let component: DashboardBrands;
  let fixture: ComponentFixture<DashboardBrands>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardBrands]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardBrands);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
