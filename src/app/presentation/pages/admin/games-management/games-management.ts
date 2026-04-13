import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { GameEntity } from '@core/domain/entities';
import { TranslatePipe } from '@ngx-translate/core';

import { FormFieldComponent } from '@presentation/components';
import { PageLayout } from '@presentation/pages/page-layout/page-layout';
import { AdminGamesStore } from '@presentation/stores';
import { Button, ContentCardLayout } from '@presentation/ui';

@Component({
  selector: 'app-games-management',
  templateUrl: './games-management.html',
  styleUrl: './games-management.scss',
  imports: [Button, CommonModule, ContentCardLayout, FormFieldComponent, PageLayout, TranslatePipe],
})
export class GamesManagementPage implements OnInit {
  private readonly store = inject(AdminGamesStore);
  private readonly router = inject(Router);

  private readonly games = computed(() => this.store.cardsCollection());
  protected readonly cardsAreLoading = computed(() => this.store.cardsAreLoading());

  protected readonly filteredGames = computed(() => {
    const term = this.form.searchTerm().value().toLowerCase().trim();

    if (!term) return this.games();

    return this.games().filter(
      (game) =>
        game.title.toLowerCase().includes(term) || game.platform?.toLowerCase().includes(term),
    );
  });

  protected readonly placeholders = Array.from({ length: 10 });

  private readonly formModel = signal<{ searchTerm: string }>({ searchTerm: '' });
  protected readonly form = form(this.formModel);

  ngOnInit(): void {
    this.store.getCardsRx();
  }

  protected createGame(): void {
    this.router.navigateByUrl('/add-game');
  }

  protected editGame(game: GameEntity): void {
    this.store.setSelectedCard(game);
    this.router.navigateByUrl('/edit-game');
  }

  protected deleteGame(game: GameEntity): void {
    if (!confirm('Are you sure you want to delete this game?')) return;
    // this.store.deleteGame(id);
  }

  protected manageSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.form.searchTerm().value.set(inputElement.value);
  }

  protected clearSearch(): void {
    this.formModel.set({ searchTerm: '' });
    this.form().reset();
  }
}
