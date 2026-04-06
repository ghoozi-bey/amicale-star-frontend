import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSondageComponent } from './edit-sondage';

describe('EditSondage', () => {
  let component: EditSondageComponent;
  let fixture: ComponentFixture<EditSondageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSondageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditSondageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
