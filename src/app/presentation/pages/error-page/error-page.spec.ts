// TODO: revisit for a better understanding of some concepts
import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ErrorPage } from './error-page';

describe('ErrorPage component', () => {
  let fixture: ComponentFixture<ErrorPage>;
  let component: ErrorPage;

  const locationMock = {
    back: vi.fn(),
  };

  afterEach(() => {
    vi.useRealTimers();
  });

  function configureTest(routeData: any = {}) {
    return TestBed.configureTestingModule({
      imports: [ErrorPage],
      providers: [
        { provide: Location, useValue: locationMock },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of(routeData),
          },
        },
      ],
    }).compileComponents();
  }

  it('should use default values when no route data is provided', async () => {
    await configureTest();

    fixture = TestBed.createComponent(ErrorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.code()).toBe('');
    expect(component.title()).toBe('Oops...');
    expect(component.message()).toBe('Something unexpected happened on our end.');
    expect(component.buttonText()).toBe('Go back');
    expect(component.showButton()).toBe(true);
  });

  it('should override values from route data', async () => {
    await configureTest({
      code: 404,
      title: 'Not Found',
      message: 'Page not found',
      buttonText: 'Retry',
      showButton: true,
    });

    fixture = TestBed.createComponent(ErrorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.code()).toBe(404);
    expect(component.title()).toBe('Not Found');
    expect(component.message()).toBe('Page not found');
    expect(component.buttonText()).toBe('Retry');
    expect(component.showButton()).toBe(true);
  });

  it('should render code when code is present', async () => {
    await configureTest({ code: 500 });

    fixture = TestBed.createComponent(ErrorPage);
    fixture.detectChanges();

    const codeEl = fixture.debugElement.query(By.css('.code'));
    const iconEl = fixture.debugElement.query(By.css('.icon'));

    expect(codeEl).not.toBeNull();
    expect(codeEl.nativeElement.textContent).toContain('500');
    expect(iconEl).toBeNull();
  });

  it('should render icon when code is empty', async () => {
    await configureTest({});

    fixture = TestBed.createComponent(ErrorPage);
    fixture.detectChanges();

    const iconEl = fixture.debugElement.query(By.css('.icon'));
    const codeEl = fixture.debugElement.query(By.css('.code'));

    expect(iconEl).not.toBeNull();
    expect(codeEl).toBeNull();
  });

  it('should not render retry button when showButton is false', async () => {
    await configureTest({ showButton: false });

    fixture = TestBed.createComponent(ErrorPage);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.retry-button'));
    expect(button).toBeNull();
  });

  it('should call onRetry and toggle clicked state on retry()', async () => {
    vi.useFakeTimers();
    await configureTest({ showButton: true });

    fixture = TestBed.createComponent(ErrorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.retry-button'));
    button.nativeElement.click();

    fixture.detectChanges();

    expect(component.isButtonClicked()).toBe(true);
    expect(locationMock.back).toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(component.isButtonClicked()).toBe(false);
  });

  it('should execute custom onRetry if overridden', async () => {
    const retrySpy = vi.fn();
    locationMock.back.mockClear();

    await configureTest();

    fixture = TestBed.createComponent(ErrorPage);
    component = fixture.componentInstance;

    component.onRetry.set(retrySpy);
    fixture.detectChanges();

    component.retry();

    expect(retrySpy).toHaveBeenCalled();
  });
});
