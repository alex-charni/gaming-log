import { Component, input, output } from '@angular/core';

import { PulseOnClickDirective } from '@presentation/directives';

@Component({
  selector: 'app-burger-button',
  templateUrl: './burger-button.html',
  styleUrl: './burger-button.scss',
  imports: [PulseOnClickDirective],
})
export class BurgerButton {
  open = input(false);
  toggle = output<boolean>();

  protected onClick(): void {
    this.toggle.emit(!this.open());
  }
}
