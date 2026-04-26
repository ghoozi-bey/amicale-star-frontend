import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SondageDetail } from './sondage-detail';

describe('SondageDetail', () => {
  let component: SondageDetail;
  let fixture: ComponentFixture<SondageDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SondageDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(SondageDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
