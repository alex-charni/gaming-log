import { Location } from '@angular/common';
import { Component, computed, inject, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { PageLayout } from '@presentation/pages/page-layout/page-layout';
import { Button, ContentCardLayout } from '@presentation/ui';

@Component({
  selector: 'app-error-page',
  templateUrl: './error.page.html',
  styleUrl: './error.page.scss',
  imports: [Button, PageLayout, ContentCardLayout],
})
export class ErrorPage {
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);

  private readonly routeData = toSignal(this.route.data, {
    initialValue: {} as {
      code?: string | number;
      message?: string;
      buttonText?: string;
      showButton?: boolean;
      title?: string;
    },
  });

  protected readonly code = signal<string | number>(
    'code' in this.routeData() ? this.routeData().code : '',
  );

  protected readonly emphasizedText = computed(() => (this.code() ? `${this.code()}` : ''));
  protected readonly icon = computed(() => (this.code() ? '' : 'fa-solid fa-exclamation'));

  protected readonly message = toSignal<string>(
    'message' in this.routeData()
      ? this.translate.stream(this.routeData().message)
      : this.translate.stream('error.unexpected_event'),
  );

  protected readonly buttonText = toSignal<string>(
    'buttonText' in this.routeData()
      ? this.translate.stream(this.routeData().buttonText)
      : this.translate.stream('common.go_back'),
  ) as Signal<string>;

  protected readonly showButton = signal(
    'showButton' in this.routeData() ? !!this.routeData().showButton : true,
  );

  protected readonly title = toSignal<string>(
    'buttonText' in this.routeData()
      ? this.translate.stream(this.routeData().title)
      : this.translate.stream('error.oops_with_ellipsis'),
  );

  protected readonly buttonAction = signal<() => void>(() => this.location.back());

  protected handleButtonAction(): void {
    this.buttonAction()?.();
  }
}
