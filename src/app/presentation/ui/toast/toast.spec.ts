import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastService } from '@presentation/services';
import { ToastStore } from '@presentation/stores';
import { createToastServiceMock, createToastStoreMock } from '@testing/mocks';
import { ToastComponent } from './toast';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastService: any;
  let toastStore: any;

  const mockStore = createToastStoreMock();

  beforeEach(async () => {
    const serviceMock = createToastServiceMock();

    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [
        { provide: ToastService, useValue: serviceMock },
        { provide: ToastStore, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    toastStore = TestBed.inject(ToastStore);

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not render toast when isOpen is false', () => {
    mockStore.isOpen.set(false);

    fixture.detectChanges();

    const toastElement = fixture.nativeElement.querySelector('.toast');

    expect(toastElement).toBeNull();
  });

  it('should render toast and display content when isOpen is true', () => {
    mockStore.isOpen.set(true);
    mockStore.title.set('Test Title');
    mockStore.message.set('Test Message');
    mockStore.icon.set('fa-check');

    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('.toast__title');
    const messageElement = fixture.nativeElement.querySelector('.toast__message');
    const iconElement = fixture.nativeElement.querySelector('.toast__icon');

    expect(titleElement.textContent).toContain('Test Title');
    expect(messageElement.textContent).toContain('Test Message');
    expect(iconElement.classList).toContain('fa-check');
  });

  it('should not render title or message if they are empty', () => {
    mockStore.isOpen.set(true);
    mockStore.title.set('');
    mockStore.message.set('');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.toast__title')).toBeNull();
    expect(fixture.nativeElement.querySelector('.toast__message')).toBeNull();
  });

  it.each([
    ['success', 'toast--success'],
    ['error', 'toast--error'],
    ['warning', 'toast--warning'],
    ['info', 'toast--info'],
  ])('should apply correct class for type %s', (type, expectedClass) => {
    mockStore.isOpen.set(true);
    mockStore.type.set(type as any);

    fixture.detectChanges();

    const toastElement = fixture.nativeElement.querySelector('.toast');

    expect(toastElement.classList).toContain(expectedClass);
  });

  it('should apply toast--closing class when isClosing is true', () => {
    mockStore.isOpen.set(true);
    mockStore.isClosing.set(true);
    fixture.detectChanges();

    const toastElement = fixture.nativeElement.querySelector('.toast');

    expect(toastElement.classList).toContain('toast--closing');
  });

  it('should call toastService.hide when close button is clicked', () => {
    mockStore.isOpen.set(true);

    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector('.toast__close');

    closeButton.click();

    expect(toastService.hide).toHaveBeenCalled();
  });
});
