import { Component, inject, signal } from '@angular/core';
import { email, form, required, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

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
  imports: [Button, FormFieldComponent],
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
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });

    required(schemaPath.password, { message: 'Password is required' });
  });

  protected onSubmit(event: Event) {
    event.preventDefault();

    submit(this.loginForm, async () => {
      this.spinnerService.setVisible(true);

      const { email, password } = this.loginModel();

      this.loginUseCase
        .execute(email, password)
        .pipe(
          finalize(() => {
            this.spinnerService.setVisible(false);
          }),
        )
        .subscribe({
          next: (response) => {
            this.authStore.login(response);
            this.router.navigateByUrl('/add-game');
          },
          error: (error) => {
            console.error(error);
            this.error.set('Login failed');
          },
        });
    });
  }

  protected onLogout(): void {
    this.spinnerService.setVisible(true);

    this.logoutUseCase
      .execute()
      .pipe(
        finalize(() => {
          this.spinnerService.setVisible(false);
        }),
      )
      .subscribe({
        next: () => {
          this.authStore.logout();
          this.router.navigateByUrl('/home');
        },
        error: (error) => {
          console.error(error);
          this.error.set('Logout failed');
        },
      });
  }
}
