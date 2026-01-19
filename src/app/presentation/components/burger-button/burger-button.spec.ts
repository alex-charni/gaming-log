// DONE
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BurgerButton } from './burger-button';

describe('BurgerButton', () => {
  let component: BurgerButton;
  let fixture: ComponentFixture<BurgerButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BurgerButton],
    }).compileComponents();

    fixture = TestBed.createComponent(BurgerButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit when onClick() is triggered and set is clicked to true and false', () => {
    vi.useFakeTimers();

    const toggleSpy = vi.spyOn(component.toggle, 'emit');

    const button = fixture.debugElement.query(By.css('.burger')).nativeElement as HTMLButtonElement;
    button.click();

    expect(toggleSpy).toHaveBeenCalled();
    expect(component['isClicked']()).toBe(true);

    vi.advanceTimersByTime(400);

    expect(component['isClicked']()).toBe(false);
  });
});
