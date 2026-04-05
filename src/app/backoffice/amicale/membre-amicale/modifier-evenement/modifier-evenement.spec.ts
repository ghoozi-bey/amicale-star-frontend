import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierEvenement } from './modifier-evenement';

describe('ModifierEvenement', () => {
  let component: ModifierEvenement;
  let fixture: ComponentFixture<ModifierEvenement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierEvenement],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifierEvenement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
