import { Directive, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PulseOnClickDirective } from '@presentation/directives';
import { Button } from './button';

@Directive({
  selector: '[appPulseOnclick]',
})
class PulseMockDirective {
  readonly duration = input<number>(300);
  readonly variant = input<string>('white');
  readonly size = input(12);
}

describe('Button', () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
    })
      .overrideComponent(Button, {
        remove: { imports: [PulseOnClickDirective] },
        add: { imports: [PulseMockDirective] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
  });

  it('should render button with required inputs and default styles', () => {
    fixture.componentRef.setInput('text', 'Click me');
    fixture.componentRef.setInput('type', 'button');

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button.textContent).toContain('Click me');
    expect(button.type).toBe('button');
    expect(button.style.height).toBe('3rem');
    expect(button.style.width).toBe('100%');
  });

  it('should apply custom height and width', () => {
    fixture.componentRef.setInput('text', 'Styled');
    fixture.componentRef.setInput('type', 'button');
    fixture.componentRef.setInput('height', '50px');
    fixture.componentRef.setInput('width', '200px');

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button.style.height).toBe('50px');
    expect(button.style.width).toBe('200px');
  });

  it('should disable the button when disabled input is true', () => {
    fixture.componentRef.setInput('text', 'Disabled');
    fixture.componentRef.setInput('type', 'button');
    fixture.componentRef.setInput('disabled', true);

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button.disabled).toBe(true);
  });

  it('should emit action when type is button', () => {
    fixture.componentRef.setInput('text', 'Action');
    fixture.componentRef.setInput('type', 'button');

    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.action, 'emit');
    const button = fixture.nativeElement.querySelector('button');

    button.click();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit action when type is submit', () => {
    fixture.componentRef.setInput('text', 'Submit');
    fixture.componentRef.setInput('type', 'submit');

    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.action, 'emit');
    const button = fixture.nativeElement.querySelector('button');

    button.click();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
