import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMessages } from './dashboard-messages';

describe('DashboardMessages', () => {
  let component: DashboardMessages;
  let fixture: ComponentFixture<DashboardMessages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardMessages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMessages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
