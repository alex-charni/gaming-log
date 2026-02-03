import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideTranslateService } from '@ngx-translate/core';
import { BurgerButton } from './burger-button';

describe('BurgerButton', () => {
  let component: BurgerButton;
  let fixture: ComponentFixture<BurgerButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BurgerButton],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(BurgerButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should emit when onClick() is triggered', () => {
    const toggleSpy = vi.spyOn(component.toggle, 'emit');

    const buttonDebugElement = fixture.debugElement.query(By.css('.burger'));

    expect(buttonDebugElement).toBeTruthy();

    const buttonNativeElement = buttonDebugElement.nativeElement as HTMLButtonElement;

    buttonNativeElement.click();

    expect(toggleSpy).toHaveBeenCalled();
  });
});
