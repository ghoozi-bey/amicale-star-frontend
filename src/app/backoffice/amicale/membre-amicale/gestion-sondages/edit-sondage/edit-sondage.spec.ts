import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSondage } from './edit-sondage';

describe('EditSondage', () => {
  let component: EditSondage;
  let fixture: ComponentFixture<EditSondage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSondage],
    }).compileComponents();

    fixture = TestBed.createComponent(EditSondage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
