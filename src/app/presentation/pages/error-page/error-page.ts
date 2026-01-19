import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.html',
  styleUrl: './error-page.scss',
})
export class ErrorPage {
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);

  private readonly routeData = toSignal(this.route.data, {
    initialValue: {} as {
      code?: string | number;
      message?: string;
      buttonText?: string;
      showButton?: boolean;
      title?: string;
    },
  });

  readonly code = signal<string | number>('');
  readonly message = signal('Something unexpected happened on our end.');
  readonly buttonText = signal('Go back');
  readonly showButton = signal(true);
  readonly title = signal('Oops...');
  readonly isButtonClicked = signal(false);
  readonly onRetry = signal<() => void>(() => this.location.back());

  constructor() {
    if ('code' in this.routeData()) this.code.set(this.routeData().code);
    if ('message' in this.routeData()) this.message.set(this.routeData().message);
    if ('buttonText' in this.routeData()) this.buttonText.set(this.routeData().buttonText);
    if ('showButton' in this.routeData()) this.showButton.set(!!this.routeData().showButton);
    if ('title' in this.routeData()) this.title.set(this.routeData().title);
  }

  retry(): void {
    this.isButtonClicked.set(true);
    setTimeout(() => this.isButtonClicked.set(false), 300);

    this.onRetry()?.();
  }
}
