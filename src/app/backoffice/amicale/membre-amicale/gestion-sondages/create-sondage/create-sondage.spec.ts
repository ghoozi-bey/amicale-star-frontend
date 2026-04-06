import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSondageComponent } from './create-sondage';

describe('CreateSondage', () => {
  let component: CreateSondageComponent;
  let fixture: ComponentFixture<CreateSondageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSondageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSondageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
