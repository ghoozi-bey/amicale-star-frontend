import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sondages } from './sondages';

describe('Sondages', () => {
  let component: Sondages;
  let fixture: ComponentFixture<Sondages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sondages],
    }).compileComponents();

    fixture = TestBed.createComponent(Sondages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
