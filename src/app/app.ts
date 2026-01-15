import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FullScreenSpinner } from '@presentation/components';

@Component({
  selector: 'app-root',
  imports: [FullScreenSpinner, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
