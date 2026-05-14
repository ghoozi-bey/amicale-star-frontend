import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttribuerRoles } from './attribuer-roles';

describe('AttribuerRoles', () => {
  let component: AttribuerRoles;
  let fixture: ComponentFixture<AttribuerRoles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttribuerRoles],
    }).compileComponents();

    fixture = TestBed.createComponent(AttribuerRoles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
