import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSelectorMenuItem } from './language-selector-menu-item';

describe('LanguageSelectorMenuItem', () => {
  let component: LanguageSelectorMenuItem;
  let fixture: ComponentFixture<LanguageSelectorMenuItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSelectorMenuItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageSelectorMenuItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
