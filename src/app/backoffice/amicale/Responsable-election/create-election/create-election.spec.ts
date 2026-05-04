import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateElection } from './create-election';

describe('CreateElection', () => {
  let component: CreateElection;
  let fixture: ComponentFixture<CreateElection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateElection],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateElection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
