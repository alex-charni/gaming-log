import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { form, required } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';

import { AddGameUseCase } from '@core/application/use-cases';
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
  cover: File | null;
}

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.page.html',
  styleUrl: './add-game.page.scss',
  imports: [ReactiveFormsModule, ImageFormField, Button, FormFieldComponent, TranslatePipe],
})
export class AddGamePage {
  private readonly addGameUseCase = inject(AddGameUseCase);
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

  private readonly INITIAL_MODEL = {
    id: '',
    title: '',
    platform: '',
    rating: '0',
    date: '',
    status: 'finished' as GameStatus,
    cover: null,
  };

  private readonly formModel = signal<AddGameData>({ ...this.INITIAL_MODEL });

  protected readonly form = form(this.formModel, (schemaPath) => {
    required(schemaPath.title, { message: 'forms.required' });
    required(schemaPath.platform, { message: 'forms.required' });
    required(schemaPath.rating, { message: 'forms.required' });
    required(schemaPath.date, { message: 'forms.required' });
    required(schemaPath.status, { message: 'forms.required' });
    required(schemaPath.cover, { message: 'forms.required' });
  });

  protected async submit(event: Event) {
    event.preventDefault();

    if (this.form().invalid()) return;

    try {
      const { cover, date, id, platform, rating, status, title } = this.formModel();

      if (!cover) throw new Error('NO FILE');

      this.spinnerService.setVisible(true);

      const placeholder = await this.imageProcessor.generatePlaceholder(cover, 32);

      if (!placeholder) throw new Error('NO PLACEHOLDER');

      await this.addGameUseCase.execute(
        title,
        platform,
        rating,
        date,
        status,
        cover,
        placeholder,
        id,
      );

      this.showSuccessToast();
      this.scrollTop();

      this.formModel.set({ ...this.INITIAL_MODEL });
    } catch (error) {
      this.showFailureToast();
      console.error(error);
    } finally {
      this.spinnerService.setVisible(false);
    }
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
}
