import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeSelectorMenuItem } from './theme-selector-menu-item';

describe('ThemeSelectorMenuItem', () => {
  let component: ThemeSelectorMenuItem;
  let fixture: ComponentFixture<ThemeSelectorMenuItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSelectorMenuItem],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeSelectorMenuItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
