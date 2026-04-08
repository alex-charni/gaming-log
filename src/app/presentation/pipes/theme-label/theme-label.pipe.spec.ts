import { ThemeLabelPipe } from './theme-label.pipe';

describe('ThemeLabelPipe', () => {
  let pipe: ThemeLabelPipe;

  beforeEach(() => {
    pipe = new ThemeLabelPipe();
  });

  it('should transform a string value to lower case with themes prefix', () => {
    expect(pipe.transform('DARK')).toBe('themes.dark');
    expect(pipe.transform('Light')).toBe('themes.light');
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
