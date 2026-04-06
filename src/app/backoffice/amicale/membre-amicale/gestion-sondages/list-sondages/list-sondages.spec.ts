import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSondagesComponent } from './list-sondages';

describe('ListSondages', () => {
  let component: ListSondagesComponent;
  let fixture: ComponentFixture<ListSondagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSondagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListSondagesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
