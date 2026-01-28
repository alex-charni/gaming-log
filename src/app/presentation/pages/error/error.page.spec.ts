// TODO: revisit for a better understanding of some concepts
import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import enTranslations from '@i18n/en.json';
import { provideI18nTesting } from '@testing/i18-testing';
import { ErrorPage } from './error.page';

describe('ErrorPage', () => {
  let fixture: ComponentFixture<ErrorPage>;
  let component: ErrorPage;

  const locationMock = {
    back: vi.fn(),
  };

  afterEach(() => {
    vi.useRealTimers();
  });

  function reconfigureTestingModule(routeData: any = {}) {
    return TestBed.configureTestingModule({
      imports: [ErrorPage],
      providers: [
        provideI18nTesting(),
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

  describe('Route data', () => {
    it('should use default values when no route data is provided', async () => {
      await reconfigureTestingModule();

      const translate = TestBed.inject(TranslateService);
      await new Promise((resolve) => translate.use('en').subscribe(resolve));

      fixture = TestBed.createComponent(ErrorPage);
      component = fixture.componentInstance;

      fixture.detectChanges();

      expect(component.code()).toBe('');
      expect(component.title()).toBe(enTranslations.error.oops_with_ellipsis);
      expect(component.message()).toBe(enTranslations.error.unexpected_event);
      expect(component.buttonText()).toBe(enTranslations.common.go_back);
      expect(component.showButton()).toBe(true);
    });

    it('should override values from route data', async () => {
      await reconfigureTestingModule({
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
  });

  describe('Template', () => {
    it('should render code when code is present', async () => {
      await reconfigureTestingModule({ code: 500 });

      fixture = TestBed.createComponent(ErrorPage);
      fixture.detectChanges();

      const codeDebugElement = fixture.debugElement.query(By.css('.code'));
      const iconDebugElement = fixture.debugElement.query(By.css('.icon'));

      expect(codeDebugElement).not.toBeNull();
      expect(codeDebugElement.nativeElement.textContent).toContain('500');
      expect(iconDebugElement).toBeNull();
    });

    it('should render icon when code is empty', async () => {
      await reconfigureTestingModule({});

      fixture = TestBed.createComponent(ErrorPage);
      fixture.detectChanges();

      const iconDebugElement = fixture.debugElement.query(By.css('.icon'));
      const codeDebugElement = fixture.debugElement.query(By.css('.code'));

      expect(iconDebugElement).not.toBeNull();
      expect(codeDebugElement).toBeNull();
    });

    it('should not render retry button when showButton is false', async () => {
      await reconfigureTestingModule({ showButton: false });

      fixture = TestBed.createComponent(ErrorPage);
      fixture.detectChanges();

      const buttonDebugElement = fixture.debugElement.query(By.css('.retry-button'));

      expect(buttonDebugElement).toBeNull();
    });

    it('should call onRetry and toggle clicked state on retry()', async () => {
      vi.useFakeTimers();
      await reconfigureTestingModule({ showButton: true });

      fixture = TestBed.createComponent(ErrorPage);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const buttonDebugElement = fixture.debugElement.query(By.css('.retry-button'));
      buttonDebugElement.nativeElement.click();

      fixture.detectChanges();

      expect(component.isButtonClicked()).toBe(true);
      expect(locationMock.back).toHaveBeenCalled();

      vi.advanceTimersByTime(300);
      fixture.detectChanges();

      expect(component.isButtonClicked()).toBe(false);
    });
  });
});
