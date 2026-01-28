// DONE
import { TestBed } from '@angular/core/testing';

import { SpinnerService } from './spinner.service';

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerService);
  });

  it('should set visible to true after executing setVisible() with true', () => {
    const visibleSpy = vi.spyOn(service.visible, 'set');

    service.setVisible(true);

    expect(visibleSpy).toHaveBeenCalledWith(true);
    expect(service.visible()).toBe(true);
  });

  it('should set visible to false after executing setVisible() with false', () => {
    const visibleSpy = vi.spyOn(service.visible, 'set');

    service.setVisible(false);

    expect(visibleSpy).toHaveBeenCalledWith(false);
    expect(service.visible()).toBe(false);
  });
});
