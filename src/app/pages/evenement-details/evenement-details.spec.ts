import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenementDetails } from './evenement-details';

describe('EvenementDetails', () => {
  let component: EvenementDetails;
  let fixture: ComponentFixture<EvenementDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvenementDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(EvenementDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
