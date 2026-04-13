import { Component, computed, inject, signal } from '@angular/core';
import { email, form, required, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { LoginUseCase, LogoutUseCase } from '@core/application/use-cases';
import { FormFieldComponent } from '@presentation/components';
import { PageLayout } from '@presentation/pages/page-layout/page-layout';
import { SpinnerService, ToastService } from '@presentation/services';
import { AuthStore } from '@presentation/stores/auth';
import { Button, ContentCardLayout } from '@presentation/ui';

interface LoginData {
  email: string;
  password: string;
}

const INITIAL_FORM_MODEL = {
  email: '',
  password: '',
};

@Component({
  selector: 'app-login-page',
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  imports: [Button, FormFieldComponent, TranslatePipe, PageLayout, ContentCardLayout],
})
export class LoginPage {
  private readonly router = inject(Router);
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly spinnerService = inject(SpinnerService);
  private readonly toastService = inject(ToastService);
  private readonly authStore = inject(AuthStore);

  protected readonly isLoggedIn = computed(() => this.authStore.isLoggedIn());

  protected readonly icon = computed(() =>
    this.isLoggedIn() ? 'fa-solid fa-unlock' : 'fa-solid fa-lock',
  );

  protected readonly title = computed(() => (this.isLoggedIn() ? 'common.logout' : 'common.login'));

  private readonly loginModel = signal<LoginData>({ ...INITIAL_FORM_MODEL });

  protected readonly loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'forms.email_required' });
    email(schemaPath.email, { message: 'forms.invalid_format' });

    required(schemaPath.password, { message: 'forms.password_required' });
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();

    submit(this.loginForm, async () => {
      const { email, password } = this.loginModel();

      this.spinnerService.setVisible(true);

      try {
        const session = await this.loginUseCase.execute(email, password);

        this.authStore.login(session);
        this.showSuccessToast('pages.auth.login_success', '', 'fa-lock-open');
        this.router.navigateByUrl('/manage-games');
      } catch (error) {
        console.error(error);
        this.showFailureToast('error.oops_exclamation', 'pages.auth.login_failed', 'fa-lock');
      } finally {
        this.spinnerService.setVisible(false);
      }
    });
  }

  protected async onLogout(): Promise<void> {
    this.spinnerService.setVisible(true);

    try {
      await this.logoutUseCase.execute();

      this.authStore.logout();
      this.showSuccessToast('pages.auth.logout_success', '', 'fa-lock');
      this.router.navigateByUrl('/home');
    } catch (error) {
      console.error(error);
      this.showFailureToast('error.oops_exclamation', 'pages.auth.logout_failed', 'fa-lock');
    } finally {
      this.spinnerService.setVisible(false);
    }
  }

  private showSuccessToast(title: string, message: string, icon: string): void {
    this.toastService.show({
      title,
      message,
      icon,
      type: 'success',
    });
  }

  private showFailureToast(title: string, message: string, icon: string): void {
    this.toastService.show({
      title,
      message,
      icon,
      type: 'error',
    });
  }
}
