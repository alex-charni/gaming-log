// DONE
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Spinner } from '@presentation/services';
import { FullScreenSpinner } from './full-screen-spinner';

class SpinnerMock {
  private activeRequests = 0;
  visible = signal(false);

  show(): void {
    this.visible.set(true);
  }

  hide(): void {
    this.visible.set(false);
  }
}

describe('FullScreenSpinner', () => {
  let component: FullScreenSpinner;
  let spinnerServiceMock: Spinner;
  let fixture: ComponentFixture<FullScreenSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullScreenSpinner],
      providers: [
        {
          provide: Spinner,
          useClass: SpinnerMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FullScreenSpinner);
    component = fixture.componentInstance;
    spinnerServiceMock = TestBed.inject(Spinner);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set visible to true when spinner service requires it', () => {
    spinnerServiceMock.show();

    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.overlay'))?.nativeElement as HTMLDivElement;

    expect(component.visible()).toBe(true);
    expect(overlay).toBeDefined();
  });

  it('should set visible to false when spinner service requires it', () => {
    spinnerServiceMock.hide();

    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.overlay'))?.nativeElement as HTMLDivElement;

    expect(component.visible()).toBe(false);
    expect(overlay).toBeUndefined();
  });
});
