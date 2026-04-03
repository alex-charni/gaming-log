import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';

import { Card } from './card';

describe('Card', () => {
  let component: Card;
  let componenRef: ComponentRef<Card>;
  let fixture: ComponentFixture<Card>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Card],
    }).compileComponents();

    fixture = TestBed.createComponent(Card);
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
