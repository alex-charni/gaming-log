import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalSeparator } from './horizontal-separator';

describe('HorizontalSeparator', () => {
  let component: HorizontalSeparator;
  let fixture: ComponentFixture<HorizontalSeparator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalSeparator],
    }).compileComponents();

    fixture = TestBed.createComponent(HorizontalSeparator);
    component = fixture.componentInstance;
  });

  it('should render only lines when text is empty', () => {
    fixture.componentRef.setInput('text', '');
    fixture.detectChanges();

    const lines = fixture.nativeElement.querySelectorAll('.separator__line');
    const textElement = fixture.nativeElement.querySelector('.separator__text');

    expect(lines.length).toBe(2);
    expect(textElement).toBeNull();
  });

  it('should apply fuchsia classes by default', () => {
    fixture.componentRef.setInput('text', 'Test');
    fixture.detectChanges();

    const line = fixture.nativeElement.querySelector('.separator__line');
    const text = fixture.nativeElement.querySelector('.separator__text');

    expect(line.classList).toContain('separator__line--fuchsia');
    expect(text.classList).toContain('separator__text--fuchsia');
  });

  it('should apply white classes when color input is white', () => {
    fixture.componentRef.setInput('text', 'Test');
    fixture.componentRef.setInput('color', 'white');
    fixture.detectChanges();

    const line = fixture.nativeElement.querySelector('.separator__line');
    const text = fixture.nativeElement.querySelector('.separator__text');

    expect(line.classList).toContain('separator__line--white');
    expect(text.classList).toContain('separator__text--white');
  });

  it('should render h2 by default when titleLevel is not provided', () => {
    fixture.componentRef.setInput('text', 'Default H2');
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h2.separator__text');

    expect(title).not.toBeNull();
    expect(title.textContent).toBe('Default H2');
  });

  it('should render h1 when titleLevel is h1', () => {
    fixture.componentRef.setInput('text', 'Title H1');
    fixture.componentRef.setInput('titleLevel', 'h1');
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h1.separator__text');

    expect(title).not.toBeNull();
    expect(title.textContent).toBe('Title H1');
  });

  it('should render h3 when titleLevel is h3', () => {
    fixture.componentRef.setInput('text', 'Title H3');
    fixture.componentRef.setInput('titleLevel', 'h3');
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h3.separator__text');

    expect(title).not.toBeNull();
    expect(title.textContent).toBe('Title H3');
  });
});
