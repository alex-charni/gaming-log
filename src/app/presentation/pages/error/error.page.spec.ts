import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { createLocationMock } from '@testing/mocks';
import { ErrorPage } from './error.page';

const locationMock = createLocationMock();

describe('ErrorPage', () => {
  let fixture: ComponentFixture<ErrorPage>;
  let component: ErrorPage;

  function reconfigureTestingModule(routeData: any = {}) {
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

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Route data', () => {
    it('should use default values when no route data is provided', async () => {
      await reconfigureTestingModule();

      const translate = TestBed.inject(TranslateService);
      await new Promise((resolve) => translate.use('en').subscribe(resolve));

      fixture = TestBed.createComponent(ErrorPage);
      component = fixture.componentInstance;

      fixture.detectChanges();

      expect(component['code']()).toBe('');
      expect(component['title']()).toBe('error.oops_with_ellipsis');
      expect(component['message']()).toBe('error.unexpected_event');
      expect(component['buttonText']()).toBe('common.go_back');
      expect(component['showButton']()).toBe(true);
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

      expect(component['code']()).toBe(404);
      expect(component['title']()).toBe('Not Found');
      expect(component['message']()).toBe('Page not found');
      expect(component['buttonText']()).toBe('Retry');
      expect(component['showButton']()).toBe(true);
    });
  });

  describe('Template', () => {
    it('should not render button when showButton is false', async () => {
      await reconfigureTestingModule({ showButton: false });

      fixture = TestBed.createComponent(ErrorPage);
      fixture.detectChanges();

      const buttonDebugElement = fixture.debugElement.query(By.css('.button'));

      expect(buttonDebugElement).toBeNull();
    });

    it('should call buttonAction on handleButtonAction()', async () => {
      await reconfigureTestingModule({ showButton: true });

      fixture = TestBed.createComponent(ErrorPage);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const buttonDebugElement = fixture.debugElement.query(By.css('.button'));
      buttonDebugElement.nativeElement.click();

      fixture.detectChanges();

      expect(locationMock.back).toHaveBeenCalled();
    });
  });
});
