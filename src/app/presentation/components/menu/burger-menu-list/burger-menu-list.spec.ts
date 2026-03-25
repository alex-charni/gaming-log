import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurgerMenuList } from './burger-menu-list';

describe('BurgerMenuList', () => {
  let component: BurgerMenuList;
  let fixture: ComponentFixture<BurgerMenuList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BurgerMenuList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BurgerMenuList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
