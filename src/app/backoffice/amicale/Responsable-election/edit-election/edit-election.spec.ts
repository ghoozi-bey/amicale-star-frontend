import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditElection } from './edit-election';

describe('EditElection', () => {
  let component: EditElection;
  let fixture: ComponentFixture<EditElection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditElection],
    }).compileComponents();

    fixture = TestBed.createComponent(EditElection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
