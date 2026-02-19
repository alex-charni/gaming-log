import { Component, input } from '@angular/core';

@Component({
  selector: 'app-horizontal-separator',
  templateUrl: './horizontal-separator.html',
  styleUrl: './horizontal-separator.scss',
})
export class HorizontalSeparator {
  readonly color = input<'fuchsia' | 'white'>('fuchsia');
  readonly text = input('');
}
