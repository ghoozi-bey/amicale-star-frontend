import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSondages } from './list-sondages';

describe('ListSondages', () => {
  let component: ListSondages;
  let fixture: ComponentFixture<ListSondages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSondages],
    }).compileComponents();

    fixture = TestBed.createComponent(ListSondages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
