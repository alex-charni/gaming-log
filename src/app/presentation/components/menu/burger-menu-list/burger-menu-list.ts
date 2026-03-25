import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-burger-menu-list',
  templateUrl: './burger-menu-list.html',
  styleUrl: './burger-menu-list.scss',
  imports: [TranslatePipe],
})
export class BurgerMenuList {
  readonly items = input<any>();
  readonly isMenuOpen = input<boolean>();

  readonly action = output<string>();

  protected handleClick(route: string): void {
    this.action.emit(route);
  }
}
