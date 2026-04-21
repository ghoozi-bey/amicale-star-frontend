import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionInscriptions } from './gestion-inscriptions';

describe('GestionInscriptions', () => {
  let component: GestionInscriptions;
  let fixture: ComponentFixture<GestionInscriptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionInscriptions],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionInscriptions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
