import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NowPlayingBanner } from './now-playing-banner';

describe('NowPlayingBanner', () => {
  let component: NowPlayingBanner;
  let fixture: ComponentFixture<NowPlayingBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NowPlayingBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NowPlayingBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
