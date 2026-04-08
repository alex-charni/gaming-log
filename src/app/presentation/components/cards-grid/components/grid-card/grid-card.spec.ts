import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MOCK_GAME_CARD } from '@testing/mocks';
import { GridCard } from './grid-card';

describe('GridCard', () => {
  let component: GridCard;
  let fixture: ComponentFixture<GridCard>;

  const mockItem = MOCK_GAME_CARD;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridCard],
    }).compileComponents();

    fixture = TestBed.createComponent(GridCard);
    component = fixture.componentInstance;
  });

  describe('Variant: placeholder', () => {
    it('should render placeholder variant by default', () => {
      fixture.detectChanges();
      const placeholder = fixture.debugElement.query(By.css('.card--placeholder'));
      expect(placeholder).toBeTruthy();
    });
  });

  describe('Variant: cover', () => {
    it('should render cover information and image', () => {
      fixture.componentRef.setInput('variant', 'cover');
      fixture.componentRef.setInput('item', mockItem);
      fixture.detectChanges();

      const card = fixture.debugElement.query(By.css('.card--cover'));
      const img = fixture.debugElement.query(By.css('img'));
      const title = fixture.debugElement.query(By.css('.card__title'));
      const platform = fixture.debugElement.query(By.css('.card__platform'));

      expect(card).toBeTruthy();
      expect(card.attributes['aria-label']).toBe(`Cover of ${mockItem.title}`);
      expect(img.nativeElement.src).toContain(mockItem.coverUrl);
      expect(title.nativeElement.textContent).toBe(mockItem.title);
      expect(platform.nativeElement.textContent).toBe(mockItem.platform);
    });

    it('should apply rainbow class when rating is 5', () => {
      fixture.componentRef.setInput('variant', 'cover');
      fixture.componentRef.setInput('item', mockItem);
      fixture.detectChanges();

      const card = fixture.debugElement.query(By.css('.card--cover'));
      expect(card.classes['card--rainbow']).toBe(true);
    });

    it('should not render cover content if item is undefined', () => {
      fixture.componentRef.setInput('variant', 'cover');
      fixture.componentRef.setInput('item', undefined);
      fixture.detectChanges();

      const card = fixture.debugElement.query(By.css('.card--cover'));

      expect(card).toBeFalsy();
    });

    it('should call handleImageError when image fails to load', () => {
      fixture.componentRef.setInput('variant', 'cover');
      fixture.componentRef.setInput('item', mockItem);
      fixture.detectChanges();

      const imgDebug = fixture.debugElement.query(By.css('img'));
      const handleSpy = vi.spyOn(component as any, 'handleImageError');

      imgDebug.triggerEventHandler('error', { target: imgDebug.nativeElement });

      expect(handleSpy).toHaveBeenCalled();
      expect(imgDebug.nativeElement.src).toContain('assets/media/images/covers/no-cover.webp');
    });

    it('should handle image error by setting fallback src', () => {
      fixture.componentRef.setInput('variant', 'cover');
      fixture.componentRef.setInput('item', mockItem);
      fixture.detectChanges();

      const imgDebug = fixture.debugElement.query(By.css('img'));
      const imgElement = imgDebug.nativeElement as HTMLImageElement;

      const errorEvent = { target: imgElement } as unknown as ErrorEvent;
      component['handleImageError'](errorEvent);

      expect(imgElement.src).toContain('assets/media/images/covers/no-cover.webp');
    });

    it('should not throw or change src if target is null in handleImageError', () => {
      fixture.componentRef.setInput('variant', 'cover');
      fixture.componentRef.setInput('item', mockItem);
      fixture.detectChanges();

      const imgDebug = fixture.debugElement.query(By.css('img'));
      const originalSrc = imgDebug.nativeElement.src;

      component['handleImageError']({ target: null } as ErrorEvent);

      expect(imgDebug.nativeElement.src).toBe(originalSrc);
    });

    it('should set fetchpriority high on image when priority input is true', () => {
      fixture.componentRef.setInput('variant', 'cover');
      fixture.componentRef.setInput('item', mockItem);
      fixture.componentRef.setInput('priority', true);
      fixture.detectChanges();

      const img = fixture.debugElement.query(By.css('img'));

      expect(img.attributes['fetchpriority']).toBe('high');
    });
  });

  describe('Variant: text', () => {
    it('should render text variant with provided text', () => {
      const testValue = '2024';

      fixture.componentRef.setInput('variant', 'text');
      fixture.componentRef.setInput('text', testValue);
      fixture.detectChanges();

      const textSpan = fixture.debugElement.query(By.css('.card__text'));
      expect(textSpan.nativeElement.textContent).toBe(testValue);
    });

    it('should apply loading class when isLoading is true', () => {
      fixture.componentRef.setInput('variant', 'text');
      fixture.componentRef.setInput('isLoading', true);
      fixture.detectChanges();

      const card = fixture.debugElement.query(By.css('.card--text'));

      expect(card.classes['card--loading']).toBe(true);
    });
  });
});
