import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  FullScreenBackdrop,
  FullScreenSpinner,
  ScrollTopButton,
  ToastComponent,
} from '@presentation/ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [FullScreenSpinner, RouterOutlet, ScrollTopButton, FullScreenBackdrop, ToastComponent],
})
export class App {}
