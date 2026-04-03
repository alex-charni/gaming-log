import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'languageLabel',
})
export class LanguageLabelPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return value ? `languages.${value.toLowerCase()}` : '';
  }
}
