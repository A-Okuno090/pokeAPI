import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FormsModule } from '@angular/forms';
import { computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import type { I_DisplayMove } from '../app.interface.model';

@Component({
  selector: 'app-poke-detail',
  imports: [FormsModule, CommonModule],
  templateUrl: './poke-detail.html',
  styleUrl: './poke-detail.css',
})
export class PokeDetail implements OnInit {
  url = '';
  // サービスのSignalを参照(名前、画像、タイプ，特性、ステータス)
  displayPokeDetail;

  // バージョングループの選択
  selectedVersionGroup = signal<string>('red-blue');
  versionGroups = signal<{ name: string; displayName: string }[]>([
    { name: 'red-blue', displayName: '赤・緑' },
    { name: 'gold-silver', displayName: '金・銀' },
    { name: 'ruby-sapphire', displayName: 'ルビー・サファイア' },
    { name: 'diamond-pearl', displayName: 'ダイヤモンド・パール' },
    { name: 'black-white', displayName: 'ブラック・ホワイト' },
    { name: 'x-y', displayName: 'X・Y' },
    { name: 'sun-moon', displayName: 'サン・ムーン' },
    { name: 'sword-shield', displayName: 'ソード・シールド' },
    { name: 'scarlet-violet', displayName: 'スカーレット・バイオレット' },
  ]);

  // 技リストを取得中かどうか
  loadingMoves = signal<boolean>(false);
  displayMoves = signal<I_DisplayMove[]>([]);

  pokeStats = computed(() => {
    const stats = this.Service.pokeDetail()?.stats || [];
    return {
      hp: (stats[0]?.base_stat || 0) + 75,
      attack: (stats[1]?.base_stat || 0) + 20,
      defense: (stats[2]?.base_stat || 0) + 20,
      specialAttack: (stats[3]?.base_stat || 0) + 20,
      specialDefense: (stats[4]?.base_stat || 0) + 20,
      speed: (stats[5]?.base_stat || 0) + 20,
    };
  });

  pokeAbilities = computed(() => {
    return this.Service.pokeDetail()?.abilities || [];
  });

  constructor(private Service: AppService, private router: Router) {
    this.displayPokeDetail = computed(() => this.Service.pokeDetail());
  }

  ngOnInit(): void {
    // ページロード時にストレージからデータを復元
    this.Service.loadPokeDetailFromStorage();
  }

  async onVersionGroupChange() {
    await this.loadMovesForVersion();
  }

  async loadMovesForVersion() {
    this.loadingMoves.set(true);
    const moves = this.Service.pokeDetail()?.moves || [];
    const selectedVersion = this.selectedVersionGroup();

    // 選択されたバージョングループでフィルタリング
    const filteredMoves = moves
      .map((moveData) => {
        const versionDetail = moveData.version_group_details.find(
          (detail) => detail.version_group.name === selectedVersion
        );
        return versionDetail ? { move: moveData.move, versionDetail } : null;
      })
      .filter((item) => item !== null);

    // 技の詳細を取得
    const moveDetails = await Promise.all(
      filteredMoves.map(async (item) => {
        if (!item) return null;
        const moveDetail = await this.Service.getMoveDetailFromUrl(item.move.url);
        const japaneseName = await this.Service.getMoveJapaneseName(item.move.url);
        const learnMethodJapanese = await this.Service.getMoveLearnMethodJapaneseName(
          item.versionDetail.move_learn_method.url
        );
        const typeJapanese = await this.Service.getTypeJapaneseName(moveDetail.type.url);

        return {
          name: item.move.name,
          japaneseName: japaneseName,
          level: item.versionDetail.level_learned_at,
          learnMethod: item.versionDetail.move_learn_method.name,
          learnMethodJapanese: learnMethodJapanese,
          type: typeJapanese,
          power: moveDetail.power,
          pp: moveDetail.pp,
          accuracy: moveDetail.accuracy,
        } as I_DisplayMove;
      })
    );

    // nullを除外してソート（レベル順、学習方法順）
    const validMoves = moveDetails.filter((move) => move !== null) as I_DisplayMove[];
    validMoves.sort((a, b) => {
      if (a.learnMethod !== b.learnMethod) {
        // レベルアップ技を最初に
        if (a.learnMethod === 'level-up') return -1;
        if (b.learnMethod === 'level-up') return 1;
      }
      return a.level - b.level;
    });

    this.displayMoves.set(validMoves);
    this.loadingMoves.set(false);
  }

  //遷移時に値を取得したい
  onclickGoYubiohuru(url: string) {
    // this.Service.getPokeDetail(url);
    this.router.navigate(['/yubiofuru-game']);
  }
}
