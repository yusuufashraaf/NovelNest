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
    const termsArray = doc.terms().json();
    const lemmatizedWords = termsArray.map((term: any) => {
      const text = term.text || '';
      const lemma = term.terms?.[0]?.lemma;
      return lemma || text;
    });

    const lemmatized = lemmatizedWords.join(' ');

    this.router.navigate(['/Browse'], {
      queryParams: { keyword: lemmatized },
    });
  }
}
