import { Component } from '@angular/core';
import { BurgerButton } from "../burger-button/burger-button";

@Component({
  selector: 'app-now-playing-banner',
  imports: [BurgerButton],
  templateUrl: './now-playing-banner.html',
  styleUrl: './now-playing-banner.scss',
})
export class NowPlayingBanner {

}
