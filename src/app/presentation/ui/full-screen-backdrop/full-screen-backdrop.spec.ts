import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenBackdrop } from './full-screen-backdrop';

describe('FullScreenBackdrop', () => {
  let component: FullScreenBackdrop;
  let fixture: ComponentFixture<FullScreenBackdrop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullScreenBackdrop],
    }).compileComponents();

    fixture = TestBed.createComponent(FullScreenBackdrop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
