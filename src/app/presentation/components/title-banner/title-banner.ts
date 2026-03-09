import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-title-banner',
  templateUrl: './title-banner.html',
  styleUrl: './title-banner.scss',
})
export class TitleBanner {
  readonly backgroundImage = input<string>('');
  readonly height = input<number>(400);
  readonly text = input<string>('');

  protected readonly backgroundStyle = computed(() => {
    const image = this.backgroundImage();
    return image ? `url(${image})` : 'none';
  });

  protected readonly heightStyle = computed(() => {
    const height = this.height();
    return `${height}px`;
  });
}
