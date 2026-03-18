import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageFormField } from './image-form-field';

describe('ImageFormField', () => {
  let component: ImageFormField;
  let fixture: ComponentFixture<ImageFormField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageFormField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageFormField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
