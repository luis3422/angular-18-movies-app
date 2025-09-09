import { Component, DestroyRef, inject } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { AsyncPipe } from '@angular/common';
import { Movie } from '../../models/movie';
import { MovieComponent } from '../../components/movie/movie.component';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [AsyncPipe, MovieComponent, InfiniteScrollModule],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']   // ✅ corregido
})
export class MoviesComponent {           // ✅ agregada la clase

  private moviesService = inject(MoviesService);
  private pageNumber = 1;
  private destroyRef  = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public moviesObs$!: Observable<any>;   // ✅ tipado como Observable
  public moviesResults: Movie[] = [];
  public searchTerm: string | null = null;

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.searchTerm = params['q'] || null;
        this.pageNumber = 1;

        if (this.searchTerm) {
          this.moviesObs$ = this.moviesService.searchMovies(this.searchTerm, this.pageNumber);
        } else {
          this.moviesObs$ = this.moviesService.fetchMoviesByType('popular', this.pageNumber);
        }

        this.moviesObs$
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((data) => {
            this.moviesResults = data.results;
          });
      });
  }

  onScroll(): void {
    this.pageNumber++;

    if (this.searchTerm) {
      this.moviesObs$ = this.moviesService.searchMovies(this.searchTerm, this.pageNumber);
    } else {
      this.moviesObs$ = this.moviesService.fetchMoviesByType('popular', this.pageNumber);
    }

    this.moviesObs$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.moviesResults = this.moviesResults.concat(data.results);
      });
  }
}
