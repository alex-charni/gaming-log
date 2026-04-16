import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { GameEntity } from '@core/domain/entities';
import { TranslatePipe } from '@ngx-translate/core';

import { FormFieldComponent } from '@presentation/components';
import { PageLayout } from '@presentation/pages/page-layout/page-layout';
import { SpinnerService } from '@presentation/services';
import { GamesManagementStore } from '@presentation/stores';
import { Button, ContentCardLayout } from '@presentation/ui';
import { FORM_BASE_MODEL, GAMES_LIST_OPTIONS } from './const';
import { ManageGameListControlsData } from './interfaces';

@Component({
  selector: 'app-games-management',
  templateUrl: './games-management.html',
  styleUrl: './games-management.scss',
  imports: [Button, CommonModule, ContentCardLayout, FormFieldComponent, PageLayout, TranslatePipe],
})
export class GamesManagementPage {
  private readonly router = inject(Router);
  private readonly spinner = inject(SpinnerService);
  private readonly store = inject(GamesManagementStore);

  private readonly games = computed(() => this.store.gamesCollection());
  protected readonly gamesAreLoading = computed(() => this.store.gamesAreLoading());

  protected readonly filteredGames = computed(() => {
    const term = this.form.searchTerm().value().toLowerCase().trim();

    if (!term) return this.games();

    return this.games().filter(
      (game) =>
        game.title.toLowerCase().includes(term) || game.platform?.toLowerCase().includes(term),
    );
  });

  protected readonly placeholders = Array.from({ length: 10 });
  protected readonly gamesListOptions = GAMES_LIST_OPTIONS;

  private readonly formModel = signal<ManageGameListControlsData>(FORM_BASE_MODEL);
  protected readonly form = form(this.formModel);

  constructor() {
    this.initEffects();
  }

  private initEffects(): void {
    effect(() => {
      switch (this.formModel().gamesList) {
        case 'featured':
          this.store.getFeaturedGamesRx();
          break;
        case 'finished':
          this.store.getGamesRx();
          break;
      }
    });

    effect(() => {
      this.spinner.setVisible(this.store.isBusy());
    });
  }

  protected createGame(): void {
    switch (this.formModel().gamesList) {
      case 'featured':
        this.router.navigateByUrl('/admin/add-featured-game');
        break;
      case 'finished':
        this.router.navigateByUrl('/admin/add-game');
        break;
    }
  }

  protected moveToFinished(game: GameEntity): void {
    this.store.setSelectedGame(game);

    this.router.navigateByUrl('/admin/archive-featured-game');
  }

  protected editGame(game: GameEntity): void {
    this.store.setSelectedGame(game);

    switch (this.formModel().gamesList) {
      case 'featured':
        this.router.navigateByUrl('/admin/edit-featured-game');
        break;
      case 'finished':
        this.router.navigateByUrl('/admin/edit-game');
        break;
    }
  }

  protected deleteGame(game: GameEntity): void {
    if (!confirm('Are you sure you want to delete this game?')) return;

    switch (this.formModel().gamesList) {
      case 'featured':
        this.store.deleteFeaturedGameRx(game.id);
        break;
      case 'finished':
        this.store.deleteGameRx(game.id);
        break;
    }
  }

  protected manageSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.form.searchTerm().value.set(inputElement.value);
  }

  protected clearSearch(): void {
    this.formModel.update((model) => ({ ...model, searchTerm: '' }));
    this.form().reset();
  }
}
