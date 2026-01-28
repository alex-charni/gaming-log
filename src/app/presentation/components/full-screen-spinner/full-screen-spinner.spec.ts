// DONE
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SpinnerService } from '@presentation/services';
import { FullScreenSpinner } from './full-screen-spinner';

class SpinnerMock {
  readonly visible = signal(false);

  setVisible(value: boolean): void {
    this.visible.set(value);
  }
}

describe('FullScreenSpinner', () => {
  let component: FullScreenSpinner;
  let spinnerServiceMock: SpinnerService;
  let fixture: ComponentFixture<FullScreenSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullScreenSpinner],
      providers: [
        {
          provide: SpinnerService,
          useClass: SpinnerMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FullScreenSpinner);
    component = fixture.componentInstance;
    spinnerServiceMock = TestBed.inject(SpinnerService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set visible to true when spinner service requires it', () => {
    spinnerServiceMock.setVisible(true);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.overlay'))?.nativeElement as HTMLDivElement;

    expect(component.visible()).toBe(true);
    expect(overlay).toBeDefined();
  });

  it('should set visible to false when spinner service requires it', () => {
    spinnerServiceMock.setVisible(false);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.overlay'))?.nativeElement as HTMLDivElement;

    expect(component.visible()).toBe(false);
    expect(overlay).toBeUndefined();
  });
});
