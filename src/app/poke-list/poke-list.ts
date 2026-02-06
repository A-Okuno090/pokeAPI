import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FormsModule } from '@angular/forms';
import { computed } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poke-list',
  imports: [FormsModule],
  templateUrl: './poke-list.html',
  styleUrl: './poke-list.css',
})
export class PokeList implements OnInit {
  // サービスのSignalを参照
  count;
  next;
  previous;
  displayPokeList;
  url = 'https://pokeapi.co/api/v2/pokemon?limit=100';

  constructor(private Service: AppService, private router: Router) {
    this.count = this.Service.count;
    this.next = this.Service.next;
    this.previous = this.Service.previous;
    this.displayPokeList = computed(() => this.Service.pokeList().sort((a, b) => a.id - b.id));
  }

  ngOnInit(): void {
    // ページロード時にストレージからデータを復元
    const hasData = this.Service.loadPokeListFromStorage();
    // ストレージにデータがない場合は API から取得
    if (!hasData) {
      this.Service.getPokeList(this.url);
    }
  }

  onclickFormatList() {
    this.Service.getPokeList(this.url);
  }
  onclickNextList() {
    this.Service.getPokeList(this.next());
  }
  onclickPreviousList() {
    const prev = this.previous();
    if (prev) {
      this.Service.getPokeList(prev);
    }
  }
  //遷移時に値を取得したい
  onclickGoDetail(url: string) {
    this.Service.getPokeDetail(url);
    this.router.navigate(['/poke-detail']);
  }
}
