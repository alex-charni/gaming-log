import { Component, inject, signal } from '@angular/core';
import { email, form, required, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { LoginUseCase, LogoutUseCase } from '@core/application/use-cases';
import { Button, FormFieldComponent } from '@presentation/components';
import { SpinnerService } from '@presentation/services';
import { AuthStore } from '@presentation/stores/auth';

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
  imports: [Button, FormFieldComponent, TranslatePipe],
})
export class LoginPage {
  private readonly router = inject(Router);
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly spinnerService = inject(SpinnerService);
  protected readonly authStore = inject(AuthStore);

  protected readonly error = signal<string | null>(null);

  private readonly loginModel = signal<LoginData>({ ...INITIAL_FORM_MODEL });

  protected readonly loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'forms.email_required' });
    email(schemaPath.email, { message: 'forms.invalid_format' });

    required(schemaPath.password, { message: 'forms.password_required' });
  });

  protected onSubmit(event: Event) {
    event.preventDefault();

    submit(this.loginForm, async () => {
      const { email, password } = this.loginModel();

      this.spinnerService.setVisible(true);

      try {
        const session = await this.loginUseCase.execute(email, password);

        this.authStore.login(session);
        this.router.navigateByUrl('/add-game');
      } catch (error) {
        console.error(error);
        this.error.set('pages.auth.login_failed');
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
      this.router.navigateByUrl('/home');
    } catch (error) {
      console.error(error);
      this.error.set('Logout failed');
    } finally {
      this.spinnerService.setVisible(false);
    }
  }
}
