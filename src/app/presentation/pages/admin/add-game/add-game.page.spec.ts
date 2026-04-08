import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AddFeaturedGameUseCase, AddGameUseCase } from '@core/application/use-cases';
import { ImageProcessorService, SpinnerService, ToastService } from '@presentation/services';
import {
  createBasicUseCaseMock,
  createEventMock,
  createImageServiceMock,
  createSpinnerServiceMock,
  createToastServiceMock,
} from '@testing/mocks';
import { AddGamePage } from './add-game.page';

describe('AddGamePage', () => {
  let component: AddGamePage;

  let addGameUseCase: any;
  let addFeaturedGameUseCase: any;
  let imageProcessor: any;
  let spinnerService: any;
  let toastService: any;

  const createComponent = (isFeatured: boolean) => {
    addGameUseCase = createBasicUseCaseMock();
    addFeaturedGameUseCase = createBasicUseCaseMock();
    imageProcessor = createImageServiceMock();
    spinnerService = createSpinnerServiceMock();
    toastService = createToastServiceMock();

    TestBed.configureTestingModule({
      imports: [AddGamePage],
      providers: [
        { provide: AddGameUseCase, useValue: addGameUseCase },
        { provide: AddFeaturedGameUseCase, useValue: addFeaturedGameUseCase },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ isFeatured }),
          },
        },
        { provide: ImageProcessorService, useValue: imageProcessor },
        { provide: SpinnerService, useValue: spinnerService },
        { provide: ToastService, useValue: toastService },
      ],
    });

    const fixture = TestBed.createComponent(AddGamePage);
    component = fixture.componentInstance;
  };

  describe('initialization', () => {
    it('should set default status to finished when not featured', () => {
      createComponent(false);

      expect((component as any).formModel().status).toBe('finished');
    });

    it('should set default status to playing when featured', () => {
      createComponent(true);

      expect((component as any).formModel().status).toBe('playing');
    });
  });

  describe('submit', () => {
    let event: any;

    beforeEach(() => {
      event = createEventMock();
    });

    it('should prevent default', async () => {
      createComponent(false);

      await component['submit'](event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should return if form is invalid', async () => {
      createComponent(false);

      vi.spyOn(component as any, 'form').mockReturnValue({
        invalid: () => true,
      });

      await component['submit'](event);

      expect(spinnerService.setVisible).not.toHaveBeenCalled();
    });

    it('should throw error when no image', async () => {
      createComponent(false);

      vi.spyOn(component as any, 'form').mockReturnValue({
        invalid: () => false,
      });

      (component as any).formModel.set({
        ...(component as any).formModel(),
        image: null,
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await component['submit'](event);

      expect(consoleSpy).toHaveBeenCalled();
      expect(toastService.show).toHaveBeenCalledWith({
        title: 'error.oops_exclamation',
        message: 'pages.admin.add_game.game_not_added',
        icon: 'fa-file-circle-xmark',
        type: 'error',
      });

      expect(spinnerService.setVisible).toHaveBeenCalledWith(false);
    });

    it('should throw error when placeholder is null', async () => {
      createComponent(false);

      vi.spyOn(component as any, 'form').mockReturnValue({
        invalid: () => false,
      });

      const file = new File([''], 'test.png');

      (component as any).formModel.set({
        ...(component as any).formModel(),
        image: file,
      });

      imageProcessor.generatePlaceholder.mockResolvedValue(null);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await component['submit'](event);

      expect(consoleSpy).toHaveBeenCalled();
      expect(toastService.show).toHaveBeenCalled();
      expect(spinnerService.setVisible).toHaveBeenCalledWith(false);
    });

    it('should execute AddGameUseCase when not featured', async () => {
      createComponent(false);

      vi.spyOn(component as any, 'form').mockReturnValue({
        invalid: () => false,
      });

      const file = new File([''], 'test.png');

      (component as any).formModel.set({
        id: '1',
        title: 'title',
        platform: 'platform',
        rating: '5',
        date: '2024-01-01',
        status: 'finished',
        image: file,
      });

      imageProcessor.generatePlaceholder.mockResolvedValue('placeholder');

      await component['submit'](event);

      expect(addGameUseCase.execute).toHaveBeenCalledWith(
        'title',
        'platform',
        'finished',
        file,
        'placeholder',
        '2024-01-01',
        '5',
        '1',
      );

      expect(toastService.show).toHaveBeenCalledWith({
        title: 'common.success_exclamation',
        message: 'pages.admin.add_game.game_added',
        icon: 'fa-file-circle-check',
        type: 'success',
      });
    });

    it('should execute AddFeaturedGameUseCase when featured', async () => {
      createComponent(true);

      vi.spyOn(component as any, 'form').mockReturnValue({
        invalid: () => false,
      });

      const file = new File([''], 'test.png');

      (component as any).formModel.set({
        id: '1',
        title: 'title',
        platform: 'platform',
        rating: '5',
        date: '2024-01-01',
        status: 'playing',
        image: file,
      });

      imageProcessor.generatePlaceholder.mockResolvedValue('placeholder');

      await component['submit'](event);

      expect(addFeaturedGameUseCase.execute).toHaveBeenCalled();
    });

    it('should handle use case error', async () => {
      createComponent(false);

      vi.spyOn(component as any, 'form').mockReturnValue({
        invalid: () => false,
      });

      const file = new File([''], 'test.png');

      (component as any).formModel.set({
        id: '1',
        title: 'title',
        platform: 'platform',
        rating: '5',
        date: '2024-01-01',
        status: 'finished',
        image: file,
      });

      imageProcessor.generatePlaceholder.mockResolvedValue('placeholder');
      addGameUseCase.execute.mockRejectedValue(new Error('fail'));

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await component['submit'](event);

      expect(consoleSpy).toHaveBeenCalled();
      expect(toastService.show).toHaveBeenCalledWith({
        title: 'error.oops_exclamation',
        message: 'pages.admin.add_game.game_not_added',
        icon: 'fa-file-circle-xmark',
        type: 'error',
      });
    });

    it('should reset form and scroll on success', async () => {
      createComponent(false);

      vi.spyOn(component as any, 'form').mockReturnValue({
        invalid: () => false,
      });

      const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

      const file = new File([''], 'test.png');

      (component as any).formModel.set({
        id: '1',
        title: 'title',
        platform: 'platform',
        rating: '5',
        date: '2024-01-01',
        status: 'finished',
        image: file,
      });

      imageProcessor.generatePlaceholder.mockResolvedValue('placeholder');

      await component['submit'](event);

      expect(scrollSpy).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });

      expect((component as any).formModel().title).toBe('');
    });

    it('should always hide spinner', async () => {
      createComponent(false);

      vi.spyOn(component as any, 'form').mockReturnValue({
        invalid: () => false,
      });

      const file = new File([''], 'test.png');

      (component as any).formModel.set({
        id: '1',
        title: 'title',
        platform: 'platform',
        rating: '5',
        date: '2024-01-01',
        status: 'finished',
        image: file,
      });

      imageProcessor.generatePlaceholder.mockResolvedValue('placeholder');

      await component['submit'](event);

      expect(spinnerService.setVisible).toHaveBeenLastCalledWith(false);
    });
  });
});
