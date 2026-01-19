// DONE
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';

import { TextCard } from './text-card';

describe('TextCard', () => {
  let component: TextCard;
  let componenRef: ComponentRef<TextCard>;
  let fixture: ComponentFixture<TextCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TextCard);
    component = fixture.componentInstance;
    componenRef = fixture.componentRef;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
