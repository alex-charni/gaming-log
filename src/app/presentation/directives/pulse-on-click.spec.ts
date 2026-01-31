import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PulseOnClickDirective } from './pulse-on-click';

@Component({
  imports: [PulseOnClickDirective],
  template: `
    <button appPulseOnclick [variant]="variant()" [duration]="duration()" [size]="size()">
      Click me
    </button>
  `,
})
class TestHostComponent {
  variant = signal<'black' | 'fuchsia' | 'white'>('white');
  duration = signal(300);
  size = signal(12);
}

describe('PulseOnClickDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let buttonEl: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, PulseOnClickDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    buttonEl = fixture.debugElement.query(By.css('button')).nativeElement;
    buttonEl.animate = vi.fn().mockReturnValue({ onfinish: null });
  });

  it('should apply custom input values using signals', () => {
    const animateSpy = vi.spyOn(buttonEl, 'animate');

    fixture.componentInstance.variant.set('fuchsia');
    fixture.componentInstance.size.set(20);
    fixture.componentInstance.duration.set(500);

    fixture.detectChanges();

    buttonEl.click();

    expect(animateSpy).toHaveBeenCalledWith(
      [
        { boxShadow: '0 0 0 0 rgba(250, 50, 150, 0.6)' },
        { boxShadow: '0 0 0 20px rgba(0, 0, 0, 0)' },
      ],
      {
        duration: 500,
        easing: 'ease-out',
      },
    );
  });
});
