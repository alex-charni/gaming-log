import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldTree, form, required } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AddFeaturedGameUseCase, AddGameUseCase } from '@core/application/use-cases';
import { GameStatus } from '@core/domain/schemas/types';
import { FormFieldComponent, ImageFormField } from '@presentation/components';
import { ImageProcessorService, SpinnerService, ToastService } from '@presentation/services';
import { Button } from '@presentation/ui';

interface AddGameData {
  id: string;
  title: string;
  platform: string;
  rating: string;
  date: string;
  status: GameStatus;
  image: File | null;
}

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.page.html',
  styleUrl: './add-game.page.scss',
  imports: [ReactiveFormsModule, ImageFormField, Button, FormFieldComponent, TranslatePipe],
})
export class AddGamePage {
  private readonly addGameUseCase = inject(AddGameUseCase);
  private readonly addFeaturedGameUseCase = inject(AddFeaturedGameUseCase);
  private readonly route = inject(ActivatedRoute);

  private readonly routeData = toSignal(this.route.data, {
    initialValue: {} as {
      isFeatured: boolean;
    },
  });

  protected readonly isFeatured = computed<boolean>(() => this.routeData().isFeatured ?? false);
  private readonly isFeaturedSnapshot = this.isFeatured();

  private readonly imageProcessor = inject(ImageProcessorService);
  private readonly spinnerService = inject(SpinnerService);
  private readonly toastService = inject(ToastService);

  protected readonly ratingOptions = [
    { label: '0', value: 0 },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
  ];

  protected readonly statusOptions = [
    { label: 'common.finished', value: 'finished' },
    { label: 'common.playing', value: 'playing' },
    { label: 'common.dropped', value: 'dropped' },
    { label: 'common.pending', value: 'pending' },
  ];

  private readonly BASE_MODEL: AddGameData = {
    title: '',
    platform: '',
    rating: '0',
    status: 'pending',
    image: null,
    id: '',
    date: '',
  };

  private readonly formModel = signal<AddGameData>(this.getInitialModel());

  protected readonly form = this.getFormModel();

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
    this.scrollTop();
    this.resetForm();
  }

  private onError(error: unknown): void {
    console.error(error);
    this.showFailureToast();
  }

  private resetForm(): void {
    this.formModel.set(structuredClone(this.getInitialModel()));
  }

  private scrollTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  private showSuccessToast(): void {
    this.toastService.show({
      title: 'common.success_exclamation',
      message: 'pages.admin.add_game.game_added',
      icon: 'fa-file-circle-check',
      type: 'success',
    });
  }

  private showFailureToast(): void {
    this.toastService.show({
      title: 'error.oops_exclamation',
      message: 'pages.admin.add_game.game_not_added',
      icon: 'fa-file-circle-xmark',
      type: 'error',
    });
  }

  private getInitialModel(): AddGameData {
    return {
      ...this.BASE_MODEL,
      status: this.isFeaturedSnapshot ? 'playing' : 'finished',
    };
  }

  private getFormModel(): FieldTree<AddGameData, string | number> {
    return form(this.formModel, (schemaPath) => {
      required(schemaPath.title, { message: 'forms.required' });
      required(schemaPath.platform, { message: 'forms.required' });
      required(schemaPath.rating, { message: 'forms.required' });
      required(schemaPath.status, { message: 'forms.required' });
      required(schemaPath.image, { message: 'forms.required' });

      if (!this.isFeaturedSnapshot) {
        required(schemaPath.date, { message: 'forms.required' });
      }
    });
  }

  private getUseCase(): AddFeaturedGameUseCase | AddGameUseCase {
    return this.isFeaturedSnapshot ? this.addFeaturedGameUseCase : this.addGameUseCase;
  }
}

// import { Component, inject, input, signal } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';
// import { form, required } from '@angular/forms/signals';
// import { TranslatePipe } from '@ngx-translate/core';

// import { AddFeaturedGameUseCase, AddGameUseCase } from '@core/application/use-cases';
// import { GameStatus } from '@core/domain/schemas/types';
// import { FormFieldComponent, ImageFormField } from '@presentation/components';
// import { ImageProcessorService, SpinnerService, ToastService } from '@presentation/services';
// import { Button } from '@presentation/ui';
// import { ActivatedRoute } from '@angular/router';
// import { toSignal } from '@angular/core/rxjs-interop';

// interface AddGameData {
//   id: string;
//   title: string;
//   platform: string;
//   rating: string;
//   date: string;
//   status: GameStatus;
//   image: File | null;
// }

// interface AddFeaturedGameData {
//   id: string;
//   title: string;
//   platform: string;
//   rating: string;
//   status: GameStatus;
//   image: File | null;
// }

// @Component({
//   selector: 'app-add-game',
//   templateUrl: './add-game.page.html',
//   styleUrl: './add-game.page.scss',
//   imports: [ReactiveFormsModule, ImageFormField, Button, FormFieldComponent, TranslatePipe],
// })
// export class AddGamePage {
//   private readonly addGameUseCase = inject(AddGameUseCase);
//   private readonly addFeaturedGameUseCase = inject(AddFeaturedGameUseCase);
//   private readonly imageProcessor = inject(ImageProcessorService);
//   private readonly spinnerService = inject(SpinnerService);
//   private readonly toastService = inject(ToastService);

//   protected readonly ratingOptions = [
//     { label: '0', value: 0 },
//     { label: '1', value: 1 },
//     { label: '2', value: 2 },
//     { label: '3', value: 3 },
//     { label: '4', value: 4 },
//     { label: '5', value: 5 },
//   ];

//   protected readonly statusOptions = [
//     { label: 'common.finished', value: 'finished' },
//     { label: 'common.playing', value: 'playing' },
//     { label: 'common.dropped', value: 'dropped' },
//     { label: 'common.pending', value: 'pending' },
//   ];

//   private readonly GAME_INITIAL_MODEL = {
//     id: '',
//     title: '',
//     platform: '',
//     rating: '0',
//     date: '',
//     status: 'finished' as GameStatus,
//     image: null,
//   };

//   private readonly FEATURED_GAME_INITIAL_MODEL = {
//     id: '',
//     title: '',
//     platform: '',
//     rating: '0',
//     status: 'finished' as GameStatus,
//     image: null,
//   };

//   private readonly gameFormModel = signal<AddGameData>({ ...this.GAME_INITIAL_MODEL });
//   private readonly featuredGameFormModel = signal<AddFeaturedGameData>({
//     ...this.FEATURED_GAME_INITIAL_MODEL,
//   });

//   private readonly route = inject(ActivatedRoute);

//   private readonly routeData = toSignal(this.route.data, {
//     initialValue: {} as {
//       isFeatured: boolean;
//     },
//   });

//   readonly isFeatured = signal(this.routeData().isFeatured);

//   constructor() {
//     console.log(this.isFeatured());
//   }
//   protected readonly gameForm = form(this.gameFormModel, (schemaPath) => {
//     required(schemaPath.title, { message: 'forms.required' });
//     required(schemaPath.platform, { message: 'forms.required' });
//     required(schemaPath.rating, { message: 'forms.required' });
//     required(schemaPath.date, { message: 'forms.required' });
//     required(schemaPath.status, { message: 'forms.required' });
//     required(schemaPath.image, { message: 'forms.required' });
//   });

//   protected readonly featuredGameForm = form(this.featuredGameFormModel, (schemaPath) => {
//     required(schemaPath.title, { message: 'forms.required' });
//     required(schemaPath.platform, { message: 'forms.required' });
//     required(schemaPath.status, { message: 'forms.required' });
//     required(schemaPath.image, { message: 'forms.required' });
//   });

//   protected async submit(event: Event) {
//     event.preventDefault();

//     try {
//       if (this.isFeatured()) await this.submitFeaturedGameForm();
//       else await this.submitGameForm();

//       this.showSuccessToast();
//       this.scrollTop();

//       this.gameFormModel.set({ ...this.GAME_INITIAL_MODEL });
//     } catch (error) {
//       this.showFailureToast();
//       console.error(error);
//     } finally {
//       this.spinnerService.setVisible(false);
//     }
//   }

//   private async submitGameForm(): Promise<void> {
//     if (this.gameForm().invalid()) return;

//     const { image, date, id, platform, rating, status, title } = this.gameFormModel();

//     if (!image) throw new Error('NO FILE');

//     this.spinnerService.setVisible(true);

//     const placeholder = await this.imageProcessor.generatePlaceholder(image, 32);

//     if (!placeholder) throw new Error('NO PLACEHOLDER');

//     await this.addGameUseCase.execute(
//       title,
//       platform,
//       rating,
//       date,
//       status,
//       image,
//       placeholder,
//       id,
//     );

//     this.showSuccessToast();
//     this.scrollTop();

//     this.gameFormModel.set({ ...this.GAME_INITIAL_MODEL });
//   }

//   private async submitFeaturedGameForm(): Promise<void> {
//     if (this.featuredGameForm().invalid()) return;

//     const { image, id, platform, rating, status, title } = this.featuredGameFormModel();

//     if (!image) throw new Error('NO FILE');

//     this.spinnerService.setVisible(true);

//     const placeholder = await this.imageProcessor.generatePlaceholder(image, 32);

//     if (!placeholder) throw new Error('NO PLACEHOLDER');

//     await this.addFeaturedGameUseCase.execute(
//       title,
//       platform,
//       status,
//       image,
//       placeholder,
//       rating,
//       id,
//     );

//     this.showSuccessToast();
//     this.scrollTop();

//     this.featuredGameFormModel.set({ ...this.FEATURED_GAME_INITIAL_MODEL });
//   }

//   private scrollTop(): void {
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth',
//     });
//   }
//   private showSuccessToast(): void {
//     this.toastService.show({
//       title: 'common.success_exclamation',
//       message: 'pages.admin.add_game.game_added',
//       icon: 'fa-file-circle-check',
//       type: 'success',
//     });
//   }

//   private showFailureToast(): void {
//     this.toastService.show({
//       title: 'error.oops_exclamation',
//       message: 'pages.admin.add_game.game_not_added',
//       icon: 'fa-file-circle-xmark',
//       type: 'error',
//     });
//   }
// }
