import { TestBed, ComponentFixture } from '@angular/core/testing';

import { Rating } from './rating';

describe('Rating', () => {
  let component: Rating;
  let fixture: ComponentFixture<Rating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rating],
    }).compileComponents();

    fixture = TestBed.createComponent(Rating);
    component = fixture.componentInstance;
  });

  describe('Rating logic (icons computed)', () => {
    it('should render a dash when rating is undefined (branch rating() || 0)', () => {
      fixture.componentRef.setInput('rating', undefined);

      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');

      expect(span.textContent).toBe('—');
      expect(component['icons']().length).toBe(0);
    });

    it('should handle rating 0 (branch rating() || 0)', () => {
      fixture.componentRef.setInput('rating', 0);

      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');

      expect(span.textContent).toBe('—');
      expect(component['icons']().length).toBe(0);
    });

    it('should render correct number of stars when rating is positive', () => {
      fixture.componentRef.setInput('rating', 3);

      fixture.detectChanges();

      const stars = fixture.nativeElement.querySelectorAll('.fa-star');

      expect(stars.length).toBe(3);
      expect(component['icons']().length).toBe(3);
    });
  });

  describe('Classes and Sizes', () => {
    it('should apply medium size class by default', () => {
      fixture.componentRef.setInput('rating', 3);

      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.rating');

      expect(container.classList).toContain('rating--medium');
    });

    it.each(['small', 'medium', 'large'] as const)('should apply %s size class', (size) => {
      fixture.componentRef.setInput('rating', 3);
      fixture.componentRef.setInput('size', size);

      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.rating');

      expect(container.classList).toContain(`rating--${size}`);
    });

    it('should apply rainbow class only when rating is exactly 5', () => {
      fixture.componentRef.setInput('rating', 4);

      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.rating').classList).not.toContain(
        'rating--rainbow',
      );

      fixture.componentRef.setInput('rating', 5);

      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.rating').classList).toContain('rating--rainbow');
    });
  });
});
