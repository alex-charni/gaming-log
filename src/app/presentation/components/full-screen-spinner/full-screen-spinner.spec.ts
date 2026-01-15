import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenSpinner } from './full-screen-spinner';

describe('FullScreenSpinner', () => {
  let component: FullScreenSpinner;
  let fixture: ComponentFixture<FullScreenSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullScreenSpinner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullScreenSpinner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
