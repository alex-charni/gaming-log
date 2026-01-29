import { TestBed } from '@angular/core/testing';

import { uiInitialState } from './ui-initial-state';
import { UiStore } from './ui.store';

describe('UiStore', () => {
  let store: InstanceType<typeof UiStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UiStore],
    });

    store = TestBed.inject(UiStore);
  });

  it('should be initialized with the provided initial state', () => {
    expect(store.fullScreenBackdrop()).toEqual(uiInitialState.fullScreenBackdrop);
    expect(store.fullScreenSpinner()).toBe(uiInitialState.fullScreenSpinner);
  });
});
