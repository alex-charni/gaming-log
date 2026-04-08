import { LanguageLabelPipe } from './language-label.pipe';

describe('LanguageLabelPipe', () => {
  let pipe: LanguageLabelPipe;

  beforeEach(() => {
    pipe = new LanguageLabelPipe();
  });

  it('should transform a string value to lower case with languages prefix', () => {
    expect(pipe.transform('EN')).toBe('languages.en');
    expect(pipe.transform('Es')).toBe('languages.es');
  });

  it('should return an empty string if value is null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return an empty string if value is undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return an empty string if value is an empty string', () => {
    expect(pipe.transform('')).toBe('');
  });
});
