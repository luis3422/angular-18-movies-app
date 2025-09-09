import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  searchTerm = '';
  constructor(private router: Router) {}

  onSearch(e: Event) {
    e.preventDefault();
    if (this.searchTerm.trim()) {
      this.router.navigate(['/movies'], {
        queryParams: { q: this.searchTerm.trim() },
      });
      this.searchTerm = '';
    }
  }
}
