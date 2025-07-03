import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCategories } from './dashboard-categories';

describe('DashboardCategories', () => {
  let component: DashboardCategories;
  let fixture: ComponentFixture<DashboardCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
