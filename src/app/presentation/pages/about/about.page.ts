import { Component, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { Rating } from '@presentation/components/rating/rating';
import { TitleBanner } from '@presentation/components/title-banner/title-banner';
import { PageLayout } from '@presentation/pages/page-layout/page-layout';
import { ContentCardLayout, HorizontalSeparator } from '@presentation/ui';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrl: './about.page.scss',
  imports: [TranslatePipe, TitleBanner, HorizontalSeparator, Rating, PageLayout, ContentCardLayout],
})
export class AboutPage {
  readonly height = input(400);

  protected readonly ratings = signal([
    { value: 5, label: 'five' },
    { value: 4, label: 'four' },
    { value: 3, label: 'three' },
    { value: 2, label: 'two' },
    { value: 1, label: 'one' },
  ]);
}
