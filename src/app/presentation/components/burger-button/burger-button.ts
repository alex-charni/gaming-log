import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-burger-button',
  templateUrl: './burger-button.html',
  styleUrl: './burger-button.scss',
})
export class BurgerButton {
  protected readonly isClicked = signal(false);
  open = input(false);
  toggle = output<boolean>();

  protected onClick(): void {
    this.isClicked.set(true);
    setTimeout(() => this.isClicked.set(false), 300);
    this.toggle.emit(!this.open());
  }
}
