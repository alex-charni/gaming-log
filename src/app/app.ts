import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FullScreenSpinner, ScrollTopButton } from '@presentation/components';

@Component({
  selector: 'app-root',
  imports: [FullScreenSpinner, RouterOutlet, ScrollTopButton],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
