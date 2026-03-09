import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleBanner } from './title-banner';

describe('TitleBanner', () => {
  let component: TitleBanner;
  let fixture: ComponentFixture<TitleBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(TitleBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
