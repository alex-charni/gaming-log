// DONE
import { TestBed } from '@angular/core/testing';

import { Spinner } from './spinner';

describe('Spinner', () => {
  let service: Spinner;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Spinner);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set visible to true after executing show()', () => {
    const visibleSpy = vi.spyOn(service.visible, 'set');
    service['activeRequests'] = 0;

    service.show();

    expect(service['activeRequests']).toEqual(1);
    expect(visibleSpy).toHaveBeenCalledWith(true);
  });

  it('should not set visible to true after executing show() with one active request already in queue', () => {
    const visibleSpy = vi.spyOn(service.visible, 'set');
    service['activeRequests'] = 1;

    service.show();

    expect(service['activeRequests']).toEqual(2);
    expect(visibleSpy).not.toHaveBeenCalledWith(true);
  });

  it('should set visible to false after executing hide()', () => {
    const visibleSpy = vi.spyOn(service.visible, 'set');
    service['activeRequests'] = 1;

    service.hide();
    expect(service['activeRequests']).toEqual(0);
    expect(visibleSpy).toHaveBeenCalledWith(false);
  });

  it('should set visible to false after executing hide() with no active request in queue', () => {
    const visibleSpy = vi.spyOn(service.visible, 'set');
    service['activeRequests'] = 0;

    service.hide();
    expect(service['activeRequests']).toEqual(0);
    expect(visibleSpy).toHaveBeenCalledWith(false);
  });

  it('should not set visible to false after executing hide() with two active requests in queue', () => {
    const visibleSpy = vi.spyOn(service.visible, 'set');
    service['activeRequests'] = 4;

    service.hide();
    expect(service['activeRequests']).toEqual(3);
    expect(visibleSpy).not.toHaveBeenCalled();
  });
});
