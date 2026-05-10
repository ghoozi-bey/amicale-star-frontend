import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionDetailPublic } from './election-detail-public';

describe('ElectionDetailPublic', () => {
  let component: ElectionDetailPublic;
  let fixture: ComponentFixture<ElectionDetailPublic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectionDetailPublic],
    }).compileComponents();

    fixture = TestBed.createComponent(ElectionDetailPublic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
