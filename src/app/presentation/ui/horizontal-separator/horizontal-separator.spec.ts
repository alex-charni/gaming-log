import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalSeparator } from './horizontal-separator';

describe('HorizontalSeparator', () => {
  let component: HorizontalSeparator;
  let fixture: ComponentFixture<HorizontalSeparator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalSeparator],
    }).compileComponents();

    fixture = TestBed.createComponent(HorizontalSeparator);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
