import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleBanner } from './title-banner';

describe('TitleBanner', () => {
  let component: TitleBanner;
  let fixture: ComponentFixture<TitleBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(TitleBanner);
    component = fixture.componentInstance;
  });

  it('should render with default values', () => {
    fixture.componentRef.setInput('text', 'Default Title');

    fixture.detectChanges();

    const banner = fixture.nativeElement.querySelector('.banner');
    const title = fixture.nativeElement.querySelector('.banner__title');

    expect(title.textContent).toBe('Default Title');
    expect(banner.style.height).toBe('400px');
    expect(banner.style.backgroundImage).toBe('none');
  });

  it('should apply custom height style', () => {
    fixture.componentRef.setInput('height', 600);

    fixture.detectChanges();

    const banner = fixture.nativeElement.querySelector('.banner');
    expect(banner.style.height).toBe('600px');
  });

  it('should apply backgroundImage style when provided', () => {
    const imageUrl = 'https://example.com';

    fixture.componentRef.setInput('backgroundImage', imageUrl);

    fixture.detectChanges();

    const banner = fixture.nativeElement.querySelector('.banner');

    expect(banner.style.backgroundImage).toContain(`url("${imageUrl}")`); // Browsers usually wrap the URL in quotes
  });

  it('should return "none" for backgroundStyle when backgroundImage is empty', () => {
    fixture.componentRef.setInput('backgroundImage', '');

    fixture.detectChanges();

    const banner = fixture.nativeElement.querySelector('.banner');

    expect(banner.style.backgroundImage).toBe('none');
  });
});
