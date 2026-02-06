import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YubiofuruGame } from './yubiofuru-game';

describe('YubiofuruGame', () => {
  let component: YubiofuruGame;
  let fixture: ComponentFixture<YubiofuruGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YubiofuruGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YubiofuruGame);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
