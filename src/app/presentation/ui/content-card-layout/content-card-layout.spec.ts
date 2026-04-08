import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentCardLayout } from './content-card-layout';

@Component({
  template: `
    <app-content-card-layout>
      <div id="test-content">Content</div>
    </app-content-card-layout>
  `,
  imports: [ContentCardLayout],
})
class TestHostComponent {}

describe('ContentCardLayout', () => {
  let component: ContentCardLayout;
  let fixture: ComponentFixture<ContentCardLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentCardLayout, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentCardLayout);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should apply default classes', () => {
    const card = fixture.nativeElement.querySelector('.card');
    const content = fixture.nativeElement.querySelector('.card__content');

    expect(card.classList).toContain('card--md');
    expect(card.classList).not.toContain('card--static');
    expect(content.classList).toContain('card__content--center');
  });

  it('should apply width and transformOnResize classes', () => {
    fixture.componentRef.setInput('width', 'sm');
    fixture.componentRef.setInput('transformOnResize', true);

    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.card');

    expect(card.classList).toContain('card--sm');
    expect(card.classList).toContain('card--static');
  });

  it('should apply alignment class to content', () => {
    fixture.componentRef.setInput('alignContent', 'right');

    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('.card__content');

    expect(content.classList).toContain('card__content--right');
  });

  it('should render emphasized text and ignore icon if both are present', () => {
    fixture.componentRef.setInput('emphasizedText', 'EMPHASIS');
    fixture.componentRef.setInput('icon', 'fa-user');

    fixture.detectChanges();

    const emphasis = fixture.nativeElement.querySelector('.card__emphasized-text');
    const icon = fixture.nativeElement.querySelector('.card__icon');

    expect(emphasis.textContent).toBe('EMPHASIS');
    expect(icon).toBeNull();
  });

  it('should render icon if no emphasized text is present', () => {
    fixture.componentRef.setInput('icon', 'fa-user');

    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('.card__icon');

    expect(icon.classList).toContain('fa-user');
  });

  it('should render h2 title by default', () => {
    fixture.componentRef.setInput('title', 'My Title');

    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h2.card__title');

    expect(title.textContent).toBe('My Title');
  });

  it('should render h1 title', () => {
    fixture.componentRef.setInput('title', 'My Title');
    fixture.componentRef.setInput('titleLevel', 'h1');

    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h1.card__title');

    expect(title).not.toBeNull();
  });

  it('should render h3 title', () => {
    fixture.componentRef.setInput('title', 'My Title');
    fixture.componentRef.setInput('titleLevel', 'h3');

    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h3.card__title');

    expect(title).not.toBeNull();
  });

  it('should project content into ng-content', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);

    hostFixture.detectChanges();

    const projectedContent = hostFixture.nativeElement.querySelector('#test-content');

    expect(projectedContent).not.toBeNull();
    expect(projectedContent.textContent).toBe('Content');
  });
});
