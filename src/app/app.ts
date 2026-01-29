import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  FullScreenBackdropComponent,
  FullScreenSpinner,
  ScrollTopButton,
} from '@presentation/components';

@Component({
  selector: 'app-root',
  imports: [FullScreenSpinner, RouterOutlet, ScrollTopButton, FullScreenBackdropComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
