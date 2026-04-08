import { TestBed } from '@angular/core/testing';

import { toastInitialState } from './toast-initial-state';
import { ToastState } from './toast-state.type';
import { ToastStore } from './toast.store';

describe('ToastStore', () => {
  let store: InstanceType<typeof ToastStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastStore],
    });

    store = TestBed.inject(ToastStore);
  });

  it('should have initial state', () => {
    expect(store.title()).toBe(toastInitialState.title);
    expect(store.message()).toBe(toastInitialState.message);
    expect(store.icon()).toBe(toastInitialState.icon);
    expect(store.type()).toBe(toastInitialState.type);
    expect(store.isOpen()).toBe(toastInitialState.isOpen);
    expect(store.isClosing()).toBe(toastInitialState.isClosing);
  });

  it('should update state when show is called', () => {
    const partialState: Partial<ToastState> = {
      title: 'Success Title',
      message: 'Operation completed',
      type: 'success',
    };

    store.show(partialState);

    expect(store.title()).toBe('Success Title');
    expect(store.message()).toBe('Operation completed');
    expect(store.type()).toBe('success');
    expect(store.isOpen()).toBe(true);
    expect(store.isClosing()).toBe(false);
  });

  it('should set isClosing to true when hide is called', () => {
    store.show({ title: 'Test' });
    store.hide();

    expect(store.isClosing()).toBe(true);
    expect(store.isOpen()).toBe(true);
  });

  it('should reset to initial state when reset is called', () => {
    store.show({ title: 'Modified', isOpen: true });
    store.hide();

    store.reset();

    expect(store.title()).toBe(toastInitialState.title);
    expect(store.isOpen()).toBe(toastInitialState.isOpen);
    expect(store.isClosing()).toBe(toastInitialState.isClosing);
  });
});
