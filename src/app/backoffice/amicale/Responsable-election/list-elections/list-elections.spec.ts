import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListElections } from './list-elections';

describe('ListElections', () => {
  let component: ListElections;
  let fixture: ComponentFixture<ListElections>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListElections],
    }).compileComponents();

    fixture = TestBed.createComponent(ListElections);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
