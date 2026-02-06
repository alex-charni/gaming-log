import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'themeLabel' })
export class ThemeLabelPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return value ? `themes.${value.toLowerCase()}` : '';
  }
}
