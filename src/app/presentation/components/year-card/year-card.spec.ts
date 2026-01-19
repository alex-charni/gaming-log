// DONE
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { YearCard } from './year-card';

describe('YearCard', () => {
  let component: YearCard;
  let componenRef: ComponentRef<YearCard>;
  let fixture: ComponentFixture<YearCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearCard],
    }).compileComponents();

    fixture = TestBed.createComponent(YearCard);
    component = fixture.componentInstance;
    componenRef = fixture.componentRef;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive data in year input', () => {
    componenRef.setInput('year', '2026');
    fixture.detectChanges();

    const textSpan = fixture.nativeElement.querySelector('span.text');

    expect(textSpan.textContent?.trim()).toEqual('2026');
  });

  it('should have default value in text input', () => {
    const textSpan = fixture.nativeElement.querySelector('span.text');

    expect(textSpan.textContent?.trim()).toEqual('');
  });

  it('should have loading class when loading signal is true', () => {
    componenRef.setInput('isLoading', true);
    fixture.detectChanges();

    const cardContainer = fixture.debugElement.query(By.css('.card'))
      ?.nativeElement as HTMLDivElement;

    expect(cardContainer.classList.contains('card--loading')).toBe(true);
  });

  it('should not have loading class when loading signal is false', () => {
    componenRef.setInput('isLoading', false);
    fixture.detectChanges();

    const cardContainer = fixture.debugElement.query(By.css('.card'))
      ?.nativeElement as HTMLDivElement;

    expect(cardContainer.classList.contains('card--loading')).toBe(false);
  });
});
