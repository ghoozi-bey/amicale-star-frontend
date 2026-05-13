import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionStats } from './election-stats';

describe('ElectionStats', () => {
  let component: ElectionStats;
  let fixture: ComponentFixture<ElectionStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectionStats],
    }).compileComponents();

    fixture = TestBed.createComponent(ElectionStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
