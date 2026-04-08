import { TestBed } from '@angular/core/testing';

import { ToastStore } from '@presentation/stores';
import { ToastState } from '@presentation/stores/toast/toast-state.type';
import { createToastStoreMock } from '@testing/mocks';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let store: any;

  beforeEach(() => {
    vi.useFakeTimers();

    const storeMock = createToastStoreMock();

    TestBed.configureTestingModule({
      providers: [ToastService, { provide: ToastStore, useValue: storeMock }],
    });

    service = TestBed.inject(ToastService);
    store = TestBed.inject(ToastStore);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should call store.show and schedule hide after 3000ms', () => {
    const config: Partial<ToastState> = { title: 'Test' };
    const hideSpy = vi.spyOn(service, 'hide');

    service.show(config);

    expect(store.show).toHaveBeenCalledWith(config);
    expect(hideSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(3000);

    expect(hideSpy).toHaveBeenCalled();
  });

  it('should call store.hide and schedule store.reset after 300ms', () => {
    service.hide();

    expect(store.hide).toHaveBeenCalled();
    expect(store.reset).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(store.reset).toHaveBeenCalled();
  });
});
