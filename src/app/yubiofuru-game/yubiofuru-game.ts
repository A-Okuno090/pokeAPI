import { Component, OnInit, Signal, signal, computed, effect } from '@angular/core';
import { AppService } from '../app.service';
import { FormsModule } from '@angular/forms';
import { I_detailTest } from '../app.interface.model';

@Component({
  selector: 'app-yubiofuru-game',
  imports: [FormsModule],
  templateUrl: './yubiofuru-game.html',
  styleUrl: './yubiofuru-game.css',
})
export class YubiofuruGame implements OnInit {
  // プロパティ
  displayPokeDetail = computed(() => this.Service.pokeDetail());
  displayPokeMove = computed(() => this.Service.pokeMove());

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

  defenseInput: number = 100;
  calculatedDamage: number | null = null;
  magikarpDamage: number | null = null;

  Magikarpstatus = {
    hp: 95,
    defense: 75,
    specialDefense: 40,
  };

  constructor(private Service: AppService) {
    // pokeDetailの変更を監視
    effect(() => {
      const detail = this.Service.pokeDetail();
      if (detail.id > 0) {
        console.log('Pokemon loaded:', detail.name);
      }
    });

    // pokeMoveの変更を監視
    effect(() => {
      const move = this.Service.pokeMove();
      if (move.id > 0) {
        console.log('Move loaded:', move.japaneseName);
      }
    });
  }

  ngOnInit() {
    // ストレージからデータを復元
    this.Service.loadPokeDetailFromStorage();
    this.Service.loadPokeMoveFromStorage();
  }

  //ランダムな技を取得 (技ID: 1-919)
  getRandomMove() {
    const randomMoveId = Math.floor(Math.random() * 937) + 1;
    const url = `https://pokeapi.co/api/v2/move/${randomMoveId}`;
    this.Service.getPokeMove(url);
  }

  // ダメージ計算
  // ダメージ = ((レベル × 2 ÷ 5 + 2) × 威力 × 攻撃 ÷ 防御 ÷ 50 + 2) × 乱数(0.85~1.00)
  calculateDamage(
    attackerLevel: number,
    movePower: number | null,
    attackStat: number,
    defenseStat: number,
    damageClass: string
  ): number {
    // 威力がnullの場合(変化技など)はダメージ0
    if (movePower === null || movePower === 0) {
      return 0;
    }

    // 基本ダメージ計算
    const levelFactor = (attackerLevel * 2) / 5 + 2;
    const baseDamage = (levelFactor * movePower * attackStat) / defenseStat / 50 + 2;

    // 乱数 (0.85 ~ 1.00)
    const randomFactor = Math.random() * 0.15 + 0.85;

    // 最終ダメージ
    const damage = Math.floor(baseDamage * randomFactor);

    return damage;
  }

  // 簡易ダメージ計算 (現在の技と攻撃側ステータスを使用)
  calculateCurrentDamage(): number {
    const move = this.displayPokeMove();
    const stats = this.pokeStats();
    const level = 50; // デフォルトレベル
    const MagikarpStatus = this.Magikarpstatus;

    // 威力がnullの場合(変化技など)はダメージ0
    if (move.power === null || move.power === 0) {
      return 0;
    }

    // 物理技か特殊技かで攻撃ステータスを選択
    const attackStat = move.damage_class.name === 'physical' ? stats.attack : stats.specialAttack;
    const defenseStat =
      move.damage_class.name === 'physical'
        ? MagikarpStatus.defense
        : MagikarpStatus.specialDefense;

    return this.calculateDamage(level, move.power, attackStat, defenseStat, move.damage_class.name);
  }

  // ダメージがコイキング何匹ぶんか計算
  calculate_MagikarpDamage(): void {
    const damage = this.calculateCurrentDamage();
    this.magikarpDamage = damage / this.Magikarpstatus.hp;
  }

  // HTMLから呼び出すダメージ計算メソッド
  calcDamage() {
    const move = this.displayPokeMove();
    const stats = this.pokeStats();
    const level = 50;

    if (move.power === null || move.power === 0) {
      this.calculatedDamage = 0;
      return;
    }

    const attackStat = move.damage_class.name === 'physical' ? stats.attack : stats.specialAttack;

    this.calculatedDamage = this.calculateDamage(
      level,
      move.power,
      attackStat,
      this.defenseInput,
      move.damage_class.name
    );
  }
}
