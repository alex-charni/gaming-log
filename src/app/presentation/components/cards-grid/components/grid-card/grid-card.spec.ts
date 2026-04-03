import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';

import { GridCard } from './grid-card';

describe('GridCard', () => {
  let component: GridCard;
  let componenRef: ComponentRef<GridCard>;
  let fixture: ComponentFixture<GridCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridCard],
    }).compileComponents();

    fixture = TestBed.createComponent(GridCard);
    component = fixture.componentInstance;
    componenRef = fixture.componentRef;

    await fixture.whenStable();
  });

  it('should receive data in text input', () => {
    componenRef.setInput('text', 'demo test');

    fixture.detectChanges();

    const textSpan = fixture.nativeElement.querySelector('span.text');

    expect(textSpan.textContent?.trim()).toEqual('demo test');
  });

  it('should have default value in text input', () => {
    const textSpan = fixture.nativeElement.querySelector('span.text');

    expect(textSpan.textContent?.trim()).toEqual('');
  });
});
