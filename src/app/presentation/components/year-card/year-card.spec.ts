import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearCard } from './year-card';

describe('YearCard', () => {
  let component: YearCard;
  let fixture: ComponentFixture<YearCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
