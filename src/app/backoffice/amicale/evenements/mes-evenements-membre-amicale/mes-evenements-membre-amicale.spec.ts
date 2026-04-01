import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesEvenementsMembreAmicale } from './mes-evenements-membre-amicale';

describe('MesEvenementsMembreAmicale', () => {
  let component: MesEvenementsMembreAmicale;
  let fixture: ComponentFixture<MesEvenementsMembreAmicale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesEvenementsMembreAmicale],
    }).compileComponents();

    fixture = TestBed.createComponent(MesEvenementsMembreAmicale);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
