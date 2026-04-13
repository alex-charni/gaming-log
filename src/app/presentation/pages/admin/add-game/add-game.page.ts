import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldTree, form, required } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { GameManagementUseCases } from '@core/application/schemas';
import {
  AddFeaturedGameUseCase,
  AddGameUseCase,
  EditFeaturedGameUseCase,
  EditGameUseCase,
  GetRemoteImageUseCase,
} from '@core/application/use-cases';
import { GameEntity } from '@core/domain/entities';
import { FormFieldComponent, ImageFormField } from '@presentation/components';
import { toGameCardModel } from '@presentation/mappers';
import { PageLayout } from '@presentation/pages/page-layout/page-layout';
import { ImageProcessorService, SpinnerService, ToastService } from '@presentation/services';
import { AdminGamesStore } from '@presentation/stores';
import { Button, ContentCardLayout } from '@presentation/ui';
import { FORM_BASE_MODEL } from './const/form-base-model';
import { RATING_OPTIONS } from './const/rating-options';
import { STATUS_OPTIONS } from './const/status-options';
import { ManageGameData } from './interfaces/manage-game-data';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.page.html',
  styleUrl: './add-game.page.scss',
  imports: [
    Button,
    ContentCardLayout,
    ImageFormField,
    FormFieldComponent,
    PageLayout,
    ReactiveFormsModule,
    TranslatePipe,
  ],
})
export class AddGamePage {
  private readonly addGameUseCase = inject(AddGameUseCase);
  private readonly addFeaturedGameUseCase = inject(AddFeaturedGameUseCase);
  private readonly editGameUseCase = inject(EditGameUseCase);
  private readonly editFeaturedGameUseCase = inject(EditFeaturedGameUseCase);
  private readonly getRemoteImageUseCase = inject(GetRemoteImageUseCase);
  private readonly adminGamesStore = inject(AdminGamesStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly imageProcessor = inject(ImageProcessorService);
  private readonly spinnerService = inject(SpinnerService);
  private readonly toastService = inject(ToastService);

  private readonly routeData = toSignal(this.route.data, {
    initialValue: {} as {
      editMode: boolean;
      isFeatured: boolean;
    },
  });

  protected readonly isEditMode = computed<boolean>(() => this.routeData().editMode ?? false);
  protected readonly isFeatured = computed<boolean>(() => this.routeData().isFeatured ?? false);

  private readonly game = computed(() =>
    this.isEditMode() ? this.adminGamesStore.selectedCard() : undefined,
  );

  protected readonly computedTitle = computed(() => {
    if (this.isFeatured() && this.isEditMode()) return 'common.edit_featured_game';
    else if (this.isFeatured()) return 'common.add_featured_game';
    else if (this.isEditMode()) return 'common.edit_game';
    else return 'common.add_game';
  });

  protected readonly ratingOptions = RATING_OPTIONS;
  protected readonly statusOptions = STATUS_OPTIONS;

  private readonly BASE_MODEL = Object.freeze<ManageGameData>(FORM_BASE_MODEL);
  private readonly formModel = signal<ManageGameData>(this.getInitialModel());
  protected readonly form = this.getFormModel();

  constructor() {
    this.initEffects();

    if (this.isEditMode() && !this.game()) this.router.navigateByUrl('/manage-games');
  }

  private initEffects(): void {
    effect((onCleanup) => {
      const game = this.game();

      if (!game || !this.isEditMode()) return;

      let cancelled = false;

      onCleanup(() => {
        cancelled = true;
      });

      this.getImage(game).then((image) => {
        if (cancelled || !image) return;

        this.formModel.update((model) => ({
          ...model,
          image,
        }));
      });
    });
  }

  protected async submit(event: Event) {
    event.preventDefault();

    if (this.form().invalid()) return;

    const model = this.formModel();

    this.spinnerService.setVisible(true);

    try {
      if (!model.image) throw new Error('NO FILE');

      const placeholder = await this.imageProcessor.generatePlaceholder(model.image, 32);

      if (!placeholder) throw new Error('NO PLACEHOLDER');

      await this.getUseCase().execute(
        model.title,
        model.platform,
        model.status,
        model.image,
        placeholder,
        model.date,
        model.rating,
        model.id,
      );

      this.onSuccess();
    } catch (error) {
      this.onError(error);
    } finally {
      this.spinnerService.setVisible(false);
    }
  }

  private onSuccess(): void {
    this.showSuccessToast();
    this.resetForm();
    this.router.navigateByUrl(this.isFeatured() ? '/manage-featured-games' : '/manage-games');
  }

  private onError(error: unknown): void {
    console.error(error);
    this.showFailureToast();
  }

  private resetForm(): void {
    this.formModel.set(structuredClone(this.getInitialModel()));
  }

  private showSuccessToast(): void {
    this.toastService.show({
      title: 'common.success_exclamation',
      message: this.isEditMode()
        ? 'pages.admin.add_game.game_edited'
        : 'pages.admin.add_game.game_added',
      icon: 'fa-file-circle-check',
      type: 'success',
    });
  }

  private showFailureToast(): void {
    this.toastService.show({
      title: 'error.oops_exclamation',
      message: this.isEditMode()
        ? 'pages.admin.add_game.game_not_edit'
        : 'pages.admin.add_game.game_not_added',
      icon: 'fa-file-circle-xmark',
      type: 'error',
    });
  }

  private async getImage(game: GameEntity): Promise<File | null> {
    try {
      const url = toGameCardModel(game).coverUrl;
      const image = await this.getRemoteImageUseCase.execute(url, `${game.id}.webp`);

      return image;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private getInitialModel(): ManageGameData {
    const game = this.game();

    return game ? this.getEditModel(game) : this.getDefaultModel();
  }

  private getEditModel(game: GameEntity): ManageGameData {
    return {
      date: game.date,
      id: game.id,
      image: null,
      platform: game.platform,
      rating: `${game.rating}`,
      status: game.status ?? 'finished',
      title: game.title,
    };
  }

  private getDefaultModel(): ManageGameData {
    return {
      ...this.BASE_MODEL,
      status: this.isFeatured() ? 'playing' : 'finished',
    };
  }

  private getFormModel(): FieldTree<ManageGameData, string | number> {
    return form(this.formModel, (schemaPath) => {
      required(schemaPath.title, { message: 'forms.required' });
      required(schemaPath.platform, { message: 'forms.required' });
      required(schemaPath.rating, { message: 'forms.required' });
      required(schemaPath.status, { message: 'forms.required' });
      required(schemaPath.image, { message: 'forms.required' });
      required(schemaPath.date, { message: 'forms.required', when: () => !this.isFeatured() });
    });
  }

  private getUseCase(): GameManagementUseCases {
    return this.isEditMode() ? this.getEditUseCase() : this.getAddUseCase();
  }

  private getAddUseCase(): AddFeaturedGameUseCase | AddGameUseCase {
    return this.isFeatured() ? this.addFeaturedGameUseCase : this.addGameUseCase;
  }

  private getEditUseCase(): EditFeaturedGameUseCase | EditGameUseCase {
    return this.isFeatured() ? this.editFeaturedGameUseCase : this.editGameUseCase;
  }
}
