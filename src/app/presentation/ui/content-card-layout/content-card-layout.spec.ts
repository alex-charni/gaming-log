import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentCardLayout } from './content-card-layout';

describe('ContentCardLayout', () => {
  let component: ContentCardLayout;
  let fixture: ComponentFixture<ContentCardLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentCardLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentCardLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
