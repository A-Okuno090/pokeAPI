// PokeAPI リスト取得時のレスポンス構造
export interface responsePokeAPI {
  count: number;
  next: string;
  previous: string | null;
  results: I_PokeResults[];
}

export interface I_PokeResults {
  name: string;
  url: string;
}

// PokeAPI ポケモン詳細取得時のレスポンス構造
export interface I_PokeData {
  id: number;
  name: string;
  height: number;
  weight: number;
  species: I_SpeciesReference;
  types: I_PokemonType[];
  abilities: I_PokemonAbility[];
  stats: I_PokemonStat[];
  sprites: I_Sprites;
  moves: I_PokemonMove[];
}

export interface I_SpeciesReference {
  name: string;
  url: string;
}

export interface I_Sprites {
  front_default: string;
  front_shiny: string;
}

// ポケモンのタイプ
export interface I_PokemonType {
  slot: number;
  type: I_NamedResource;
}

// ポケモンの特性
export interface I_PokemonAbility {
  ability: I_NamedResource;
  is_hidden: boolean;
  slot: number;
}

// ポケモンのステータス
export interface I_PokemonStat {
  base_stat: number;
  effort: number;
  stat: I_NamedResource;
}
//ポケモンが覚える技;
export interface I_PokemonMove {
  move: I_NamedResource;
  version_group_details: I_PokemonMoveVersion[];
}

export interface I_PokemonMoveVersion {
  level_learned_at: number;
  version_group: I_NamedResource;
  move_learn_method: I_NamedResource;
}

//
// 汎用: 名前と URL を持つリソース参照
export interface I_NamedResource {
  name: string;
  url: string;
  japaneseName?: string;
}

// ===== 特性（Ability）関連のデータ構造 =====

// PokeAPI 特性詳細取得時のレスポンス構造
export interface I_AbilityDetail {
  id: number;
  name: string;
  is_main_series: boolean;
  generation: I_NamedResource;
  names: I_Name[];
  effect_entries: I_EffectEntry[];
  effect_changes: I_AbilityEffectChange[];
  flavor_text_entries: I_FlavorTextEntry[];
  pokemon: I_AbilityPokemon[];
}

export interface I_Name {
  name: string;
  language: I_NamedResource;
}

export interface I_EffectEntry {
  effect: string;
  short_effect: string;
  language: I_NamedResource;
}

export interface I_AbilityEffectChange {
  effect_entries: I_EffectEntry[];
  version_group: I_NamedResource;
}

export interface I_FlavorTextEntry {
  flavor_text: string;
  language: I_NamedResource;
  version_group: I_NamedResource;
}

export interface I_AbilityPokemon {
  is_hidden: boolean;
  slot: number;
  pokemon: I_NamedResource;
}

// ===== 技（Move）関連のデータ構造 =====

// PokeAPI 技詳細取得時のレスポンス構造
export interface I_MoveDetail {
  id: number;
  name: string;
  accuracy: number | null;
  effect_chance: number | null;
  pp: number;
  priority: number;
  power: number | null;
  damage_class: I_NamedResource;
  effect_entries: I_EffectEntry[];
  effect_changes: I_MoveEffectChange[];
  generation: I_NamedResource;
  meta: I_MoveMeta;
  names: I_Name[];
  flavor_text_entries: I_FlavorTextEntry[];
  target: I_NamedResource;
  type: I_NamedResource;
  contest_type: I_NamedResource | null;
  contest_effect: I_ContestEffectReference | null;
  super_contest_effect: I_ContestEffectReference | null;
  past_values: I_PastMoveStatValues[];
  stat_changes: I_MoveStatChange[];
  learned_by_pokemon: I_NamedResource[];
}

export interface I_MoveEffectChange {
  effect_entries: I_EffectEntry[];
  version_group: I_NamedResource;
}

export interface I_MoveMeta {
  ailment: I_NamedResource;
  ailment_chance: number;
  category: I_NamedResource;
  crit_rate: number;
  drain: number;
  flinch_chance: number;
  healing: number;
  max_hits: number | null;
  max_turns: number | null;
  min_hits: number | null;
  min_turns: number | null;
  stat_chance: number;
}

export interface I_ContestEffectReference {
  url: string;
}

export interface I_PastMoveStatValues {
  accuracy: number | null;
  effect_chance: number | null;
  power: number | null;
  pp: number | null;
  effect_entries: I_EffectEntry[];
  type: I_NamedResource | null;
  version_group: I_NamedResource;
}

export interface I_MoveStatChange {
  change: number;
  stat: I_NamedResource;
}

// ===== タイプ（Type）関連のデータ構造 =====

// PokeAPI タイプ詳細取得時のレスポンス構造
export interface I_TypeDetail {
  id: number;
  name: string;
  damage_relations: I_TypeRelations;
  game_indices: I_GenerationGameIndex[];
  generation: I_NamedResource;
  move_damage_class: I_NamedResource | null;
  names: I_Name[];
  pokemon: I_TypePokemon[];
  moves: I_NamedResource[];
}

export interface I_TypeRelations {
  no_damage_to: I_NamedResource[];
  half_damage_to: I_NamedResource[];
  double_damage_to: I_NamedResource[];
  no_damage_from: I_NamedResource[];
  half_damage_from: I_NamedResource[];
  double_damage_from: I_NamedResource[];
}

export interface I_GenerationGameIndex {
  game_index: number;
  generation: I_NamedResource;
}

export interface I_TypePokemon {
  slot: number;
  pokemon: I_NamedResource;
}

// ===== バージョン・世代関連のデータ構造 =====

// PokeAPI バージョン詳細取得時のレスポンス構造
export interface I_VersionDetail {
  id: number;
  name: string;
  names: I_Name[];
  version_group: I_NamedResource;
}

// PokeAPI バージョングループ詳細取得時のレスポンス構造
export interface I_VersionGroupDetail {
  id: number;
  name: string;
  order: number;
  generation: I_NamedResource;
  move_learn_methods: I_NamedResource[];
  pokedexes: I_NamedResource[];
  regions: I_NamedResource[];
  versions: I_NamedResource[];
}

// PokeAPI 世代詳細取得時のレスポンス構造
export interface I_GenerationDetail {
  id: number;
  name: string;
  abilities: I_NamedResource[];
  names: I_Name[];
  main_region: I_NamedResource;
  moves: I_NamedResource[];
  pokemon_species: I_NamedResource[];
  types: I_NamedResource[];
  version_groups: I_NamedResource[];
}

// ポケモン種族（Species）詳細
export interface I_PokemonSpeciesDetail {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: I_NamedResource;
  pokedex_numbers: I_PokemonSpeciesDexEntry[];
  egg_groups: I_NamedResource[];
  color: I_NamedResource;
  shape: I_NamedResource;
  evolves_from_species: I_NamedResource | null;
  evolution_chain: I_EvolutionChainReference;
  habitat: I_NamedResource | null;
  generation: I_NamedResource;
  names: I_Name[];
  pal_park_encounters: I_PalParkEncounterArea[];
  flavor_text_entries: I_FlavorTextEntry[];
  form_descriptions: I_Description[];
  genera: I_Genus[];
  varieties: I_PokemonSpeciesVariety[];
}

export interface I_PokemonSpeciesDexEntry {
  entry_number: number;
  pokedex: I_NamedResource;
}

export interface I_EvolutionChainReference {
  url: string;
}

export interface I_PalParkEncounterArea {
  base_score: number;
  rate: number;
  area: I_NamedResource;
}

export interface I_Description {
  description: string;
  language: I_NamedResource;
}

export interface I_Genus {
  genus: string;
  language: I_NamedResource;
}

export interface I_PokemonSpeciesVariety {
  is_default: boolean;
  pokemon: I_NamedResource;
}

// 進化チェーン詳細
export interface I_EvolutionChainDetail {
  id: number;
  baby_trigger_item: I_NamedResource | null;
  chain: I_ChainLink;
}

export interface I_ChainLink {
  is_baby: boolean;
  species: I_NamedResource;
  evolution_details: I_EvolutionDetail[];
  evolves_to: I_ChainLink[];
}

export interface I_EvolutionDetail {
  item: I_NamedResource | null;
  trigger: I_NamedResource;
  gender: number | null;
  held_item: I_NamedResource | null;
  known_move: I_NamedResource | null;
  known_move_type: I_NamedResource | null;
  location: I_NamedResource | null;
  min_level: number | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  needs_overworld_rain: boolean;
  party_species: I_NamedResource | null;
  party_type: I_NamedResource | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: I_NamedResource | null;
  turn_upside_down: boolean;
}

//各コンポーネントの構造まとめ
export interface I_ListDisplay {
  id: number;
  name: string;
  imgDefault: string;
  imgShiny: string;
  url: string;
}

export interface I_detailTest {
  id: number;
  name: string;
  imgDefault: string;
  imgShiny: string;
  url: string;
  stats: I_PokemonStat[];
  abilities: { name: string; japaneseName: string; isHidden: boolean }[];
  moves: I_PokemonMove[];
}

// コンポーネントで使用する技情報（簡易版）
export interface I_Move {
  id: number;
  name: string;
  japaneseName: string;
  pp: number;
  power: number | null;
  type: I_NamedResource;
  damage_class: I_NamedResource;
  accuracy: number | null;
}

// バージョングループ選択用
export interface I_VersionGroupOption {
  name: string;
  displayName: string;
}

// 表示用の技リスト
export interface I_DisplayMove {
  name: string;
  japaneseName: string;
  level: number;
  learnMethod: string;
  learnMethodJapanese: string;
  type: string;
  power: number | null;
  pp: number;
  accuracy: number | null;
}
