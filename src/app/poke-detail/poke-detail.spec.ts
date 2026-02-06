import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeDetail } from './poke-detail';

describe('PokeDetail', () => {
  let component: PokeDetail;
  let fixture: ComponentFixture<PokeDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokeDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokeDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
