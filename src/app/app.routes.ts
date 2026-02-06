import { Routes } from '@angular/router';
import { PokeList } from './poke-list/poke-list';
import { PokeDetail } from './poke-detail/poke-detail';
import { YubiofuruGame } from './yubiofuru-game/yubiofuru-game';

export const routes: Routes = [
  { path: 'poke-list', component: PokeList },
  { path: 'poke-detail', component: PokeDetail },
  { path: 'yubiofuru-game', component: YubiofuruGame },
];
