import { Component, computed, input } from '@angular/core';

import { Header } from '@presentation/components';

@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.html',
  styleUrl: './page-layout.scss',
  imports: [Header],
})
export class PageLayout {
  readonly centerVertically = input(false);
  readonly contentMaxSize = input<string>('xl');
  readonly showHeader = input(true);
  readonly transformOnResize = input(true);

  protected readonly containerClasses = computed(() => ({
    [`page__container--${this.contentMaxSize()}`]: true,
    'page__container--center-Y': this.centerVertically(),
  }));

  protected readonly pageClasses = computed(() => ({
    [`page--${this.contentMaxSize()}`]: true,
    [`page--static-bg`]: !this.transformOnResize(),
  }));
}
