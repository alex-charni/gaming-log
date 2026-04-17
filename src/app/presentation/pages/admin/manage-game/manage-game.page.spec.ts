import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import {
  AddFeaturedGameUseCase,
  AddGameUseCase,
  ArchiveFeaturedGameUseCase,
  EditFeaturedGameUseCase,
  EditGameUseCase,
  GetRemoteImageUseCase,
} from '@core/application/use-cases';
import { ImageProcessorService, SpinnerService, ToastService } from '@presentation/services';
import { GamesManagementStore } from '@presentation/stores';
import {
  createBasicUseCaseMock,
  createEventMock,
  createGamesManagementStoreMock,
  createImageServiceMock,
  createSpinnerServiceMock,
  createToastServiceMock,
} from '@testing/mocks';
import { ManageGamePage } from './manage-game.page';
import { routes } from 'src/app/app.routes';

const storeMock = createGamesManagementStoreMock();

describe('ManageGamePage', () => {
  let component: ManageGamePage;

  let archiveFeaturedGameUseCase: any;
  let addGameUseCase: any;
  let addFeaturedGameUseCase: any;
  let editFeaturedGameUseCase: any;
  let editGameUseCase: any;
  let getRemoteImageUseCase: any;
  let imageProcessor: any;
  let spinnerService: any;
  let toastService: any;

  const createComponent = (archiveMode: boolean, editMode: boolean, isFeatured: boolean) => {
    archiveFeaturedGameUseCase = createBasicUseCaseMock();
    addGameUseCase = createBasicUseCaseMock();
    addFeaturedGameUseCase = createBasicUseCaseMock();
    editFeaturedGameUseCase = createBasicUseCaseMock();
    editGameUseCase = createBasicUseCaseMock();
    getRemoteImageUseCase = createBasicUseCaseMock();
    imageProcessor = createImageServiceMock();
    spinnerService = createSpinnerServiceMock();
    toastService = createToastServiceMock();

    TestBed.configureTestingModule({
      imports: [ManageGamePage],
      providers: [
        { provide: ArchiveFeaturedGameUseCase, useValue: archiveFeaturedGameUseCase },
        { provide: AddGameUseCase, useValue: addGameUseCase },
        { provide: AddFeaturedGameUseCase, useValue: addFeaturedGameUseCase },
        { provide: EditFeaturedGameUseCase, useValue: editFeaturedGameUseCase },
        { provide: EditGameUseCase, useValue: editGameUseCase },
        { provide: GetRemoteImageUseCase, useValue: getRemoteImageUseCase },
        { provide: ImageProcessorService, useValue: imageProcessor },
        { provide: SpinnerService, useValue: spinnerService },
        { provide: ToastService, useValue: toastService },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ archiveMode, editMode, isFeatured }),
          },
        },
        provideRouter(routes),
      ],
    })
      .overrideProvider(GamesManagementStore, { useValue: storeMock })
      .compileComponents();

    const fixture = TestBed.createComponent(ManageGamePage);
    component = fixture.componentInstance;
  };

  describe('initialization', () => {
    it('should set default status to finished when not featured', () => {
      createComponent(false, false, false);

      expect((component as any).formModel().status).toBe('finished');
    });
  });

  describe('submit', () => {
    let event: any;

    beforeEach(() => {
      event = createEventMock();
    });

    it('should prevent default', async () => {
      createComponent(false, false, false);

      await component['submit'](event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should return if form is invalid', async () => {
      createComponent(false, false, false);

      vi.spyOn(component as any, 'form').mockReturnValue({
        invalid: () => true,
      });

      await component['submit'](event);

      expect(spinnerService.setVisible).not.toHaveBeenCalled();
    });

    it('should throw error when no image', async () => {
      createComponent(false, false, false);

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
        message: 'pages.admin.manage_game.game_not_added',
        icon: 'fa-file-circle-xmark',
        type: 'error',
      });

      expect(spinnerService.setVisible).toHaveBeenCalledWith(false);
    });

    it('should throw error when placeholder is null', async () => {
      createComponent(false, false, false);

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
      createComponent(false, false, false);

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
        message: 'pages.admin.manage_game.game_added',
        icon: 'fa-file-circle-check',
        type: 'success',
      });
    });

    it('should execute AddFeaturedGameUseCase when featured', async () => {
      createComponent(false, false, true);

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

      expect((component as any).getUseCase().execute).toHaveBeenCalled();
    });

    it('should handle use case error', async () => {
      createComponent(false, false, false);

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
        message: 'pages.admin.manage_game.game_not_added',
        icon: 'fa-file-circle-xmark',
        type: 'error',
      });
    });

    it('should always hide spinner', async () => {
      createComponent(false, false, false);

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
