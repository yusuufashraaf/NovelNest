import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import nlp from 'compromise';
import * as sw from 'stopword'; 

@Component({
  selector: 'app-search',
  templateUrl: './search.html',
  imports: [FormsModule],
  styleUrl: './search.css',
  standalone: true,
})
export class Search {
  searchTerm = '';

  constructor(private router: Router) {}

  onSearch() {
    const trimmed = this.searchTerm.trim().toLowerCase();

    if (!trimmed) {
      this.router.navigate(['/Browse'], {
        queryParams: { keyword: null },
        queryParamsHandling: 'merge',
      });
      return;
    }

    const rawWords = nlp(trimmed).terms().out('array') as string[];
    const filteredWords = sw.removeStopwords(rawWords);

    const doc = nlp(filteredWords.join(' '));
    const lemmatizedWords = doc
      .terms()
      .map((term: any) => term.lemma || term.text);
    const lemmatized = lemmatizedWords.join(' ');

    this.router.navigate(['/Browse'], {
      queryParams: { keyword: lemmatized },
    });
  }
}
