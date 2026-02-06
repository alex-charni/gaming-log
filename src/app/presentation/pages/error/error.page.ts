import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PulseOnClickDirective } from '@presentation/directives';

@Component({
  selector: 'app-error-page',
  templateUrl: './error.page.html',
  styleUrl: './error.page.scss',
  imports: [PulseOnClickDirective],
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

  readonly code = signal<string | number>('code' in this.routeData() ? this.routeData().code : '');

  readonly message = toSignal<string>(
    'message' in this.routeData()
      ? this.translate.stream(this.routeData().message)
      : this.translate.stream('error.unexpected_event'),
  );

  readonly buttonText = toSignal<string>(
    'buttonText' in this.routeData()
      ? this.translate.stream(this.routeData().buttonText)
      : this.translate.stream('common.go_back'),
  );

  readonly showButton = signal(
    'showButton' in this.routeData() ? !!this.routeData().showButton : true,
  );

  readonly title = toSignal<string>(
    'buttonText' in this.routeData()
      ? this.translate.stream(this.routeData().title)
      : this.translate.stream('error.oops_with_ellipsis'),
  );

  readonly buttonAction = signal<() => void>(() => this.location.back());

  protected handleButtonAction(): void {
    this.buttonAction()?.();
  }
}
