import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProducts } from './dashboard-products';

describe('DashboardProducts', () => {
  let component: DashboardProducts;
  let fixture: ComponentFixture<DashboardProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
