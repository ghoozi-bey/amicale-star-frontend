import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SondageResults } from './sondage-results';

describe('SondageResults', () => {
  let component: SondageResults;
  let fixture: ComponentFixture<SondageResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SondageResults],
    }).compileComponents();

    fixture = TestBed.createComponent(SondageResults);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
