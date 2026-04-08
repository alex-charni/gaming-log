import { TestBed, ComponentFixture } from '@angular/core/testing';

import { BurgerMenuList } from './burger-menu-list';

describe('BurgerMenuList', () => {
  let component: BurgerMenuList;
  let fixture: ComponentFixture<BurgerMenuList>;

  const mockItems = [
    { label: 'menu.home', route: '/home', icon: 'fa-house' },
    { label: 'menu.profile', route: '/profile', icon: 'fa-user' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BurgerMenuList],
    }).compileComponents();

    fixture = TestBed.createComponent(BurgerMenuList);
    component = fixture.componentInstance;
  });

  it('should render the list of items correctly', () => {
    fixture.componentRef.setInput('items', mockItems);

    fixture.detectChanges();

    const listItems = fixture.nativeElement.querySelectorAll('.menu__item');
    const buttons = fixture.nativeElement.querySelectorAll('.button');
    const icons = fixture.nativeElement.querySelectorAll('.icon');

    expect(listItems.length).toBe(2);
    expect(buttons[0].textContent).toContain('menu.home');
    expect(icons[0].classList).toContain('fa-house');
  });

  it('should apply menu__item--visible class when isMenuOpen is true', () => {
    fixture.componentRef.setInput('items', mockItems);
    fixture.componentRef.setInput('isMenuOpen', true);

    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('.menu__item');

    expect(item.classList).toContain('menu__item--visible');
  });

  it('should not apply menu__item--visible class when isMenuOpen is false', () => {
    fixture.componentRef.setInput('items', mockItems);
    fixture.componentRef.setInput('isMenuOpen', false);

    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('.menu__item');

    expect(item.classList).not.toContain('menu__item--visible');
  });

  it('should emit action with route when an item is clicked', () => {
    fixture.componentRef.setInput('items', mockItems);

    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.action, 'emit');
    const firstItem = fixture.nativeElement.querySelector('.menu__item');

    firstItem.click();

    expect(emitSpy).toHaveBeenCalledWith('/home');
  });
});
