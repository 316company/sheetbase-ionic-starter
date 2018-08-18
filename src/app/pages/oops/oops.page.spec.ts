import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OopsPage } from './oops.page';

describe('OopsPage', () => {
  let component: OopsPage;
  let fixture: ComponentFixture<OopsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OopsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OopsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
