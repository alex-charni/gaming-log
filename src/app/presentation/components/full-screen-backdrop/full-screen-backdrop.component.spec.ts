import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenBackdropComponent } from './full-screen-backdrop.component';

describe('FullScreenBackdropComponent', () => {
  let component: FullScreenBackdropComponent;
  let fixture: ComponentFixture<FullScreenBackdropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullScreenBackdropComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FullScreenBackdropComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
