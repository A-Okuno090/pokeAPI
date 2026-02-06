import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeList } from './poke-list';

describe('PokeList', () => {
  let component: PokeList;
  let fixture: ComponentFixture<PokeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokeList],
    }).compileComponents();

    fixture = TestBed.createComponent(PokeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
