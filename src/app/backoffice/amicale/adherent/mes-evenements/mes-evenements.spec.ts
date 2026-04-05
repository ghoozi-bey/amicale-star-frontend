import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesEvenements } from './mes-evenements';

describe('MesEvenements', () => {
  let component: MesEvenements;
  let fixture: ComponentFixture<MesEvenements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesEvenements],
    }).compileComponents();

    fixture = TestBed.createComponent(MesEvenements);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
