import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import {
  responsePokeAPI,
  I_PokeData,
  I_ListDisplay,
  I_detailTest,
  I_Move,
  I_MoveDetail,
  I_AbilityDetail,
  I_TypeDetail,
  I_VersionDetail,
  I_VersionGroupDetail,
  I_GenerationDetail,
  I_PokemonSpeciesDetail,
  I_EvolutionChainDetail,
} from './app.interface.model';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly STORAGE_KEY = {
    pokeList: 'pokeAPI_pokeList',
    pokeDetail: 'pokeAPI_pokeDetail',
    pokeListPagination: 'pokeAPI_pagination',
    pokeMove: 'pokeAPI_pokeMove',
  };

  count = signal(0);
  next = signal('');
  previous = signal<string | null>('');
  pokeList = signal<I_ListDisplay[]>([
    {
      id: 0,
      name: '',
      imgDefault: '',
      imgShiny: '',
      url: '',
    },
  ]);
  pokeDetail = signal<I_detailTest>({
    id: 0,
    name: '',
    imgDefault: '',
    imgShiny: '',
    url: '',
    stats: [],
    abilities: [],
    moves: [],
  });

  pokeMove = signal<I_Move>({
    id: 0,
    name: '',
    japaneseName: '',
    pp: 0,
    power: null,
    type: { name: '', url: '' },
    damage_class: { name: '', url: '' },
    accuracy: null,
  });

  constructor(private httpClient: HttpClient) {}
  getPokeList(url: string) {
    this.httpClient.get<responsePokeAPI>(url).subscribe({
      next: (x) => {
        // 各プロパティに代入
        this.count.set(x.count);
        this.previous.set(x.previous);
        this.next.set(x.next);
        //配列の初期化
        this.pokeList.set([
          {
            id: 0,
            name: '',
            imgDefault: '',
            imgShiny: '',
            url: '',
          },
        ]);
        // resultsの全要素に対してIDとImageを取得
        x.results.forEach((item) => {
          this.getListDisplay(item.url);
        });
        // ストレージに保存
        setTimeout(() => this.savePokeListToStorage(), 100);
      },
    });
  }
  getListDisplay(url: string) {
    this.httpClient.get<I_PokeData>(url).subscribe({
      next: async (x) => {
        const japaneseName = await this.getPokemonJapaneseName(x.species.url);
        this.pokeList.update((list) => [
          ...list,
          {
            id: x.id,
            name: japaneseName,
            imgDefault: x.sprites.front_default,
            imgShiny: x.sprites.front_shiny,
            url: url,
          },
        ]);
      },
    });
  }
  getPokeDetail(url: string) {
    this.httpClient.get<I_PokeData>(url).subscribe({
      next: async (x) => {
        const japaneseName = await this.getPokemonJapaneseName(x.species.url);

        // abilities の日本語名を取得
        const abilitiesWithJapanese = await Promise.all(
          x.abilities.map(async (ability) => ({
            name: ability.ability.name,
            japaneseName: await this.getAbilityJapaneseName(ability.ability.url),
            isHidden: ability.is_hidden,
          }))
        );

        this.pokeDetail.set({
          id: x.id,
          name: japaneseName,
          imgDefault: x.sprites.front_default,
          imgShiny: x.sprites.front_shiny,
          url: url,
          stats: x.stats,
          abilities: abilitiesWithJapanese,
          moves: x.moves,
        });
        // ストレージに保存
        this.savePokeDetailToStorage();
      },
    });
  }

  //ToDo:日本語化のサービスを作る

  async getPokemonJapaneseName(url: string): Promise<string> {
    const response = await fetch(url);
    const data = await response.json();
    const japaneseName = data.names.find(
      (name: { language: { name: string } }) => name.language.name === 'ja'
    )?.name;
    return japaneseName || '名前なし';
  }

  async getTypeJapaneseName(url: string): Promise<string> {
    const response = await fetch(url);
    const data = await response.json();
    const japaneseName = data.names.find(
      (name: { language: { name: string } }) => name.language.name === 'ja'
    )?.name;
    return japaneseName || data.name;
  }

  async getAbilityJapaneseName(url: string): Promise<string> {
    const response = await fetch(url);
    const data = await response.json();
    const japaneseName = data.names.find(
      (name: { language: { name: string } }) => name.language.name === 'ja'
    )?.name;
    return japaneseName || data.name;
  }

  async getDamageClassJapaneseName(url: string): Promise<string> {
    const response = await fetch(url);
    const data = await response.json();
    const japaneseName = data.names.find(
      (name: { language: { name: string } }) => name.language.name === 'ja'
    )?.name;
    return japaneseName || data.name;
  }

  async getMoveJapaneseName(url: string): Promise<string> {
    const response = await fetch(url);
    const data = await response.json();
    const japaneseName = data.names?.find(
      (name: { language: { name: string } }) => name.language.name === 'ja'
    )?.name;
    return japaneseName || data.name;
  }

  async getMoveLearnMethodJapaneseName(url: string): Promise<string> {
    const response = await fetch(url);
    const data = await response.json();
    const japaneseName = data.names?.find(
      (name: { language: { name: string } }) => name.language.name === 'ja'
    )?.name;
    return japaneseName || data.name;
  }

  async getMoveDetailFromUrl(url: string): Promise<I_MoveDetail> {
    const response = await fetch(url);
    return await response.json();
  }

  //Todo:指を振るゲームのステータスを作る
  getPokeMove(url: string) {
    this.httpClient.get<I_MoveDetail>(url).subscribe({
      next: async (x) => {
        const japaneseName = x.names?.find((name) => name.language.name === 'ja')?.name || x.name;

        const typeJapaneseName = await this.getTypeJapaneseName(x.type.url);
        const damageClassJapaneseName = await this.getDamageClassJapaneseName(x.damage_class.url);

        this.pokeMove.set({
          id: x.id,
          name: x.name,
          japaneseName: japaneseName,
          pp: x.pp,
          power: x.power,
          type: { ...x.type, japaneseName: typeJapaneseName },
          damage_class: { ...x.damage_class, japaneseName: damageClassJapaneseName },
          accuracy: x.accuracy,
        });
        // ストレージに保存
        this.savePokeMovToStorage();
      },
    });
  }

  // ========== ローカルストレージ管理 ==========

  // リスト情報を保存
  savePokeListToStorage(): void {
    const data = {
      pokeList: this.pokeList(),
      count: this.count(),
      next: this.next(),
      previous: this.previous(),
    };
    localStorage.setItem(this.STORAGE_KEY.pokeListPagination, JSON.stringify(data));
  }

  // リスト情報を復元
  loadPokeListFromStorage(): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY.pokeListPagination);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.pokeList.set(data.pokeList);
        this.count.set(data.count);
        this.next.set(data.next);
        this.previous.set(data.previous);
        return true;
      } catch (e) {
        console.error('Failed to load pokeList from storage:', e);
        return false;
      }
    }
    return false;
  }

  // 詳細情報を保存
  savePokeDetailToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY.pokeDetail, JSON.stringify(this.pokeDetail()));
  }

  // 詳細情報を復元
  loadPokeDetailFromStorage(): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY.pokeDetail);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.pokeDetail.set(data);
        return true;
      } catch (e) {
        console.error('Failed to load pokeDetail from storage:', e);
        return false;
      }
    }
    return false;
  }

  // 技情報を保存
  savePokeMovToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY.pokeMove, JSON.stringify(this.pokeMove()));
  }

  // 技情報を復元
  loadPokeMoveFromStorage(): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY.pokeMove);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.pokeMove.set(data);
        return true;
      } catch (e) {
        console.error('Failed to load pokeMove from storage:', e);
        return false;
      }
    }
    return false;
  }

  // ストレージをクリア
  clearStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY.pokeList);
    localStorage.removeItem(this.STORAGE_KEY.pokeDetail);
    localStorage.removeItem(this.STORAGE_KEY.pokeListPagination);
    localStorage.removeItem(this.STORAGE_KEY.pokeMove);
  }
}
