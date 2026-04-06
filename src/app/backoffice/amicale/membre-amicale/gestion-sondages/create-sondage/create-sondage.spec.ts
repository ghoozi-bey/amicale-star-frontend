import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSondage } from './create-sondage';

describe('CreateSondage', () => {
  let component: CreateSondage;
  let fixture: ComponentFixture<CreateSondage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSondage],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSondage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
