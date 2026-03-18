import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { form, required } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { v4 as uuidv4 } from 'uuid';

import { AddGameCoverUseCase, AddGameUseCase } from '@core/application/use-cases';
import { GameEntity } from '@core/domain/entities';
import { GameStatus, Rating } from '@core/domain/schemas/types';
import { Button, FormFieldComponent, ImageFormField } from '@presentation/components';

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
  private readonly addGameCoverUseCase = inject(AddGameCoverUseCase);

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
      const { date, id, platform, rating, status, title, cover } = this.formModel();

      if (!cover) throw 'NO FILE';

      const identifier = id ? id : uuidv4();

      await this.addGameCoverUseCase.execute(identifier, cover, 'webp');

      const game: GameEntity = {
        date,
        id: identifier,
        platform,
        rating: parseInt(rating) as Rating,
        status,
        title,
      };

      await this.addGameUseCase.execute(game);

      this.formModel.set({ ...this.INITIAL_MODEL });
    } catch (error) {
      console.error(error);
    }
  }
}
