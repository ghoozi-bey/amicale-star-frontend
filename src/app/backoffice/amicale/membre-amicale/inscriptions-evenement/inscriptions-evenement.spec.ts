import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionsEvenement } from './inscriptions-evenement';

describe('InscriptionsEvenement', () => {
  let component: InscriptionsEvenement;
  let fixture: ComponentFixture<InscriptionsEvenement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscriptionsEvenement],
    }).compileComponents();

    fixture = TestBed.createComponent(InscriptionsEvenement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
